import React, { useCallback, useEffect, useState } from "react";
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Smile, Link as LinkIcon } from "lucide-react";
import Spinner from "../Spinner.jsx";

import ReCAPTCHA from "react-google-recaptcha";

const actionCodeSettings = {
	url: "https://tracker.ffede.ar/login/passwordless/callback",
	handleCodeInApp: true,
};

const PasswordlessLogin = ({ onSignInSuccess, from, signIn }) => {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [recaptchaValid, setCaptchaValid] = useState(false);
	const [emailForSignIn, setEmailForSignIn] = useState();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onCaptchaChange = (value) => {
		setCaptchaValid(Boolean(value));
	};

	useEffect(() => {
		if (signIn) {
			if (isSignInWithEmailLink(auth, window.location.href)) {
				let email = window.localStorage.getItem("emailForSignIn");
				if (!email) {
					email = window.prompt("Por favor, proveé to email para confirmar el inicio de sesión");
				}
				setEmailForSignIn(email);
			} else {
				navigate("/login/passwordless");
			}
		}
	}, [navigate, signIn]);

	useEffect(() => {
		if (emailForSignIn) {
			handleSignIn();
		}
	});

	const handleSignIn = useCallback(async () => {
		try {
			console.log(emailForSignIn, window.location.href);
			const user = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
			window.localStorage.removeItem("emailForSignIn");

			onSignInSuccess && onSignInSuccess(user);
			const to = typeof from === "string" ? from : from?.pathname || "/home";
			navigate(to === "/" ? "/home" : to, { replace: true });
		} catch (err) {
			let errorMessage = "Ocurrió un error desconocido. " + (err.code || "");
			switch (err.code) {
				case "auth/invalid-email":
					errorMessage = "Email invalido, intentá de nuevo";
					break;
				case "auth/invalid-action-code":
					errorMessage = "Código inválido, el link puede ya haber sido usado o haber expirado";
					break;
				default:
					console.error("Authentication Error:", err.code, err.message);
					toast.error(errorMessage);
					break;
			}
		}
	}, [emailForSignIn, from, navigate, onSignInSuccess]);

	const handleAuth = async (data) => {
		setLoading(true);
		try {
			await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);
			window.localStorage.setItem("emailForSignIn", data.email);
			toast.success("Passwordless link enviado correctamente, corroborá to casilla de email");
			setDone(true);
		} catch (err) {
			let errorMessage = "Ocurrió un error desconocido. " + (err.code || "");
			switch (err.code) {
				case "auth/quota-exceeded":
					errorMessage = "Quota excedida. Intentá nuevamente más tarde o usá otro método para iniciar sesión";
					break;
				default:
					toast.error(errorMessage);
					console.error("Authentication Error:", err.code, err.message);
					break;
			}

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleAuth)} className='space-y-4'>
			<div className='mb-3'>
				<h3 className='text-2xl font-semibold flex items-center justify-center gap-2'>
					{" "}
					<Smile className='inline w-5 h-5 mr-1' /> ¡Hola! Que bueno tenerte de nuevo
				</h3>
				<h4 className='text-xl mt-2'>{signIn ? "Procesando código..." : "Te vamos a enviar un email para que inicies sesión"}</h4>
			</div>
			<div className='space-y-2 text-start'>
				<Label htmlFor='email'>
					<Mail className='inline w-4 h-4 mr-1' /> Email
				</Label>
				<Input
					id='email'
					type='email'
					placeholder='mail@example.com'
					autoComplete='username'
					disabled={signIn || done}
					value={emailForSignIn}
					className={errors.email ? "border-destructive" : ""}
					{...register("email", { required: true })}
				/>
				{errors.email && <p className='text-sm text-destructive'>Un email es requerido</p>}
			</div>

			<div className='flex justify-center mb-3'>
				<ReCAPTCHA hl='es' sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} />
			</div>

			<Button type='submit' disabled={loading || done || signIn || !recaptchaValid} className='w-full'>
				{loading || signIn ? (
					<>
						<Spinner className='mr-2' />
						Cargando...
					</>
				) : (
					<>
						<LinkIcon className='inline w-4 h-4 mr-2' /> Enviar Link
					</>
				)}
			</Button>
			{signIn ? (
				<p className='text-muted-foreground mt-2 text-center'>
					¿El login no funcionó?{" "}
					<NavLink className='text-primary hover:underline' to='/login/passwordless'>
						Intentá de nuevo
					</NavLink>{" "}
					o{" "}
					<NavLink className='text-primary hover:underline' to='/login'>
						probá otro método
					</NavLink>
				</p>
			) : (
				<>
					<p className='text-muted-foreground mt-2 mb-0 text-center'>
						¿Preferís usar tu contraseña?{" "}
						<NavLink className='text-primary hover:underline' to='/login'>
							Iniciar sesión con contraseña
						</NavLink>
					</p>
					<p className='text-muted-foreground mt-1 text-center'>
						¿No tenés una cuenta?{" "}
						<NavLink className='text-primary hover:underline' to='/register'>
							Registrate
						</NavLink>
					</p>
				</>
			)}
		</form>
	);
};

export default PasswordlessLogin;
