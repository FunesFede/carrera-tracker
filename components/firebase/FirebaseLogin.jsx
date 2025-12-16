import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router";
import { Button, Col, Container, FloatingLabel, Form, InputGroup, Row, Stack } from "react-bootstrap";

const FirebaseLogin = ({ onSignInSuccess, from }) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const handleAuth = async (data) => {
		setLoading(true);
		try {
			const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
			const user = userCredential.user;

			onSignInSuccess && onSignInSuccess(user);
			const to = typeof from === "string" ? from : from?.pathname || "/";
			navigate(to, { replace: true });
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
		<Form onSubmit={handleSubmit(handleAuth)}>
			<div className='mb-3'>
				<h3>
					{" "}
					<i className='bi bi-emoji-smile-fill'></i> ¡Hola! Que bueno tenerte de nuevo
				</h3>
				<h4>Por favor, iniciá sesión</h4>
			</div>
			<Form.Group className='mb-3 text-start'>
				{/* <Form.Label htmlFor='email'>
					<i className='bi bi-envelope-at-fill'></i> Email
				</Form.Label> */}
				<FloatingLabel
					label={
						<>
							<i className='bi bi-envelope-at-fill'></i> Email
						</>
					}
				>
					<Form.Control
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

			<Form.Group className='mb-3 text-start'>
				<FloatingLabel
					label={
						<>
							<i className='bi bi-eye-slash-fill'></i> Contraseña
						</>
					}
				>
					<Form.Control
						isInvalid={errors.password}
						placeholder='********'
						autoComplete='current-password'
						id='pass'
						type={"password"}
						{...register("password", { required: true })}
					/>

					{errors.password && <Form.Control.Feedback type='invalid'>Una contraseña es requerida</Form.Control.Feedback>}
				</FloatingLabel>
			</Form.Group>

			<Stack gap={3}>
				<Button variant='primary' type='submit' disabled={loading}>
					{loading ? (
						<>
							<span className='spinner-border spinner-border-sm' aria-hidden='true'></span>
							<span role='status'> Cargando...</span>
						</>
					) : (
						<>
							<i className='bi bi-box-arrow-in-right'></i> Iniciar Sesión
						</>
					)}
				</Button>

				<NavLink className='btn btn-outline-secondary' role='button' to='/login/passwordless'>
					<i className='bi bi-key-fill'></i> Passwordless Login
				</NavLink>
			</Stack>

			<p className='text-secondary mt-2 mb-0'>
				¿Olvidaste tu contraseña?{" "}
				<NavLink className='link-underline link-underline-opacity-0' to='/login/passwordreset'>
					Reestablecer contraseña
				</NavLink>
			</p>
			<p className='text-secondary mt-1'>
				¿No tenés una cuenta?{" "}
				<NavLink className='link-underline link-underline-opacity-0' to='/register'>
					Registrate
				</NavLink>
			</p>
		</Form>
	);
};

export default FirebaseLogin;
