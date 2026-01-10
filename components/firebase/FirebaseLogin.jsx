import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { Smile, Mail, EyeOff, LogIn, Key, Loader2 } from "lucide-react";

import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "../../utils/contexts/UserContext";

const FirebaseLogin = () => {
	const [loading, setLoading] = useState(false);
	const [captchaValid, setCaptchaValid] = useState(false);
	const navigate = useNavigate();
	const { user } = useUser();

	useEffect(() => {
		if (user) navigate("/home");
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onCaptchaChange = (value) => {
		setCaptchaValid(Boolean(value));
	};

	const handleAuth = async (data) => {
		if (!captchaValid) return;
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);
			navigate("/home");
		} catch (err) {
			let errorMessage = "Ocurrió un error desconocido. " + (err.code || "");
			switch (err.code) {
				case "auth/invalid-credential":
					errorMessage = "Credenciales inválidas. Verifica tu email y contraseña.";
					break;
				case "auth/user-disabled":
					errorMessage = "Tu cuenta se encuentra deshabilitada.";
					break;
				case "auth/password-does-not-meet-requirements":
					errorMessage = "Tu contraseña ya no cumple con lo requerimentos, por favor, reestablecela.";
					break;
				default:
					console.error("Authentication Error:", err.code, err.message);
					break;
			}

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleAuth)} className='space-y-4'>
				<div className='mb-6 text-center'>
					<h3 className='text-2xl font-semibold flex items-center justify-center gap-2'>
						<Smile className='h-6 w-6' />
						¡Hola! Que bueno tenerte de nuevo
					</h3>
					<h4 className='text-xl mt-2'>Por favor, iniciá sesión</h4>
				</div>

				<FormField
					control={form.control}
					name='email'
					rules={{ required: "Un email es requerido" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-2'>
								<Mail className='h-4 w-4' />
								Email
							</FormLabel>
							<FormControl>
								<Input {...field} type='email' placeholder='mail@example.com' autoComplete='username' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					rules={{ required: "Una contraseña es requerida" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex items-center gap-2'>
								<EyeOff className='h-4 w-4' />
								Contraseña
							</FormLabel>
							<FormControl>
								<Input {...field} type='password' placeholder='********' autoComplete='current-password' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-center'>
					<ReCAPTCHA hl='es' sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} />
				</div>

				<div className='space-y-2'>
					<Button variant='default' type='submit' disabled={loading || !captchaValid} className='w-full'>
						{loading ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Cargando...
							</>
						) : (
							<>
								<LogIn className='mr-2 h-4 w-4' />
								Iniciar Sesión
							</>
						)}
					</Button>

					<NavLink to='/login/passwordless'>
						<Button variant='outline' type='button' className='w-full mt-2'>
							<Key className='mr-2 h-4 w-4' />
							Passwordless Login
						</Button>
					</NavLink>
				</div>

				<p className='text-muted-foreground mt-2 text-center'>
					¿Olvidaste tu contraseña?{" "}
					<NavLink className='text-primary hover:underline' to='/login/passwordreset'>
						Reestablecer contraseña
					</NavLink>
				</p>
				<p className='text-muted-foreground text-center'>
					¿No tenés una cuenta?{" "}
					<NavLink className='text-primary hover:underline' to='/register'>
						Registrate
					</NavLink>
				</p>
			</form>
		</Form>
	);
};

export default FirebaseLogin;
