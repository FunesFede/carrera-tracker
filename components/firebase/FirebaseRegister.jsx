import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from "lucide-react";
import { Spinner } from "../Spinner";

import ReCAPTCHA from "react-google-recaptcha";

const FirebaseRegister = ({ onSignInSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [recaptchaValid, setCaptchaValid] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onCaptchaChange = (value) => {
		setCaptchaValid(Boolean(value));
	};

	const handleAuth = async (data) => {
		if (!recaptchaValid) return;
		setLoading(true);
		try {
			let userCredential;
			userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
			await updateProfile(userCredential.user, { displayName: data.displayName });
			onSignInSuccess(userCredential.user);
			navigate("/", { replace: true });

			await sendEmailVerification(userCredential.user);
			toast.info("Te enviamos un correo de verificación automaticamente, revisá tu bandeja de entrada para verificar tu dirección email");
		} catch (err) {
			let errorMessage = "Ocurrió un error desconocido. " + err.code;
			switch (err.code) {
				case "auth/email-already-in-use":
					errorMessage = "El email proporcionado ya está en uso.";
					break;

				case "auth/password-does-not-meet-requirements":
					var regex = /\[[^\]]*\]/i;
					var requirements = regex.exec(err.message)[0].replaceAll("[", "").replaceAll("]", "");
					errorMessage = "La contraseña no cumple con los requisitos: " + requirements;
					break;

				default:
					console.error("Authentication Error:", err.code);
					console.error("Mensaje: ", err.message);
					break;
			}

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleAuth)} className='space-y-4'>
			<div className='mb-3 text-center'>
				<img src='/images/logo_2.png' className='grayscale dark:grayscale-0' alt='Logo UTN' width={35} height={40} draggable={false} />
				<h3>¡Bienvenido a tu carrera tracker!</h3>
				<h4>Por favor, completá tu registro</h4>
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='name'>
					<User className='inline w-4 h-4 mr-1' /> Nombre
				</Label>
				<Input
					id='name'
					type='text'
					placeholder='Gabriel'
					autoComplete='name'
					className={errors.displayName ? "border-destructive" : ""}
					{...register("displayName", { required: true })}
				/>
				{errors.displayName && <p className='text-sm text-destructive'>Un nombre es requerido</p>}
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='email'>
					<Mail className='inline w-4 h-4 mr-1' /> Email
				</Label>
				<Input
					id='email'
					type='email'
					placeholder='gabriel@example.com'
					autoComplete='username'
					className={errors.email ? "border-destructive" : ""}
					{...register("email", { required: true })}
				/>
				{errors.email && <p className='text-sm text-destructive'>Un email es requerido</p>}
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='pass'>
					<Lock className='inline w-4 h-4 mr-1' /> Contraseña
				</Label>
				<Input
					id='pass'
					type='password'
					placeholder='*****'
					autoComplete='current-password'
					className={errors.password ? "border-destructive" : ""}
					{...register("password", { required: true })}
				/>
				{errors.password && <p className='text-sm text-destructive'>Una contraseña es requerida</p>}
			</div>

			<div className='flex justify-center mb-3'>
				<ReCAPTCHA hl='es' sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} />
			</div>

			<Button type='submit' disabled={loading || !recaptchaValid} className='w-full'>
				{loading ? (
					<>
						<Spinner className='mr-2' />
						Cargando...
					</>
				) : (
					<>
						<User className='inline w-4 h-4 mr-2' /> Registrarse
					</>
				)}
			</Button>
			<p className='text-muted-foreground mt-2 text-center'>
				¿Ya tenés una cuenta?{" "}
				<NavLink className='text-primary hover:underline' to='/login'>
					Iniciá sesión
				</NavLink>
			</p>
		</form>
	);
};

export default FirebaseRegister;
