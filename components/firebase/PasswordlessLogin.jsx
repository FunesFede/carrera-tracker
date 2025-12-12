import React, { useEffect, useState } from "react";
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router";
import { Button, Container, FloatingLabel, Form, InputGroup } from "react-bootstrap";

const actionCodeSettings = {
	url: "https://carrera.ffede.ar/login/passwordless/callback",
	handleCodeInApp: true,
	linkDomain: "carrera.ffede.ar",
};

const PasswordlessLogin = ({ onSignInSuccess, from, signIn }) => {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [emailForSignIn, setEmailForSignIn] = useState();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

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
	}, []);

	useEffect(() => {
		if (emailForSignIn) {
			handleSignIn();
		}
	}, [emailForSignIn]);

	const handleSignIn = async () => {
		try {
			console.log(emailForSignIn, window.location.href);
			const user = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
			window.localStorage.removeItem("emailForSignIn");

			onSignInSuccess && onSignInSuccess(user);
			const to = typeof from === "string" ? from : from?.pathname || "/";
			navigate(to, { replace: true });
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
	};

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
		<Form onSubmit={handleSubmit(handleAuth)}>
			<div className='mb-3'>
				<h3>
					{" "}
					<i className='bi bi-emoji-smile-fill'></i> ¡Hola! Que bueno tenerte de nuevo
				</h3>
				<h4>{signIn ? "Procesando código..." : "Te vamos a enviar un email para que inicies sesión"}</h4>
			</div>
			<Form.Group className='mb-3 text-start'>
				<FloatingLabel
					label={
						<>
							<i className='bi bi-envelope-at-fill'></i> Email
						</>
					}
				>
					<Form.Control
						disabled={signIn || done}
						value={emailForSignIn}
						id='email'
						isInvalid={errors.email}
						autoComplete='username'
						type='email'
						placeholder='mail@example.com'
						{...register("email", { required: true })}
					/>

					{errors.email && <Form.Control.Feedback type='invalid'>Un email es requerido</Form.Control.Feedback>}
				</FloatingLabel>
			</Form.Group>

			<Button variant='primary' type='submit' disabled={loading || done || signIn}>
				{loading || signIn ? (
					<>
						<span className='spinner-border spinner-border-sm' aria-hidden='true'></span>
						<span role='status'> Cargando...</span>
					</>
				) : (
					<>
						<i className='bi bi-link'></i> Enviar Link
					</>
				)}
			</Button>
			{signIn ? (
				<p className='text-secondary mt-2'>
					¿El login no funcionó?{" "}
					<NavLink className='link-underline link-underline-opacity-0' to='/login/passwordless'>
						Intentá de nuevo
					</NavLink>{" "}
					o{" "}
					<NavLink className='link-underline link-underline-opacity-0' to='/login'>
						probá otro método
					</NavLink>
				</p>
			) : (
				<>
					<p className='text-secondary mt-2 mb-0'>
						¿Preferís usar tu contraseña?{" "}
						<NavLink className='link-underline link-underline-opacity-0' to='/login'>
							Iniciá sesión con contraseña
						</NavLink>
					</p>
					<p className='text-secondary mt-1'>
						¿No tenés una cuenta?{" "}
						<NavLink className='link-underline link-underline-opacity-0' to='/register'>
							Registrate
						</NavLink>
					</p>
				</>
			)}
		</Form>
	);
};

export default PasswordlessLogin;
