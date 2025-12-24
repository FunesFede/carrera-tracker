import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";

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
		<Form onSubmit={handleSubmit(handleAuth)}>
			<div className='mb-3'>
				<img src='/images/logo_2.png' alt='Logo UTN' width={35} height={40} draggable={false} />
				<h3>¡Bienvenido a tu carrera tracker!</h3>
				<h4>Por favor, completá tu registro</h4>
			</div>

			<Form.Group className='mb-3 text-start'>
				<FloatingLabel
					label={
						<>
							<i className='bi bi-person-badge'></i> Nombre
						</>
					}
				>
					<Form.Control isInvalid={errors.displayName} placeholder='Gabriel' autoComplete='name' id='name' type='text' {...register("displayName", { required: true })} />

					{errors.displayName && <Form.Control.Feedback type='invalid'>Un nombre es requerido</Form.Control.Feedback>}
				</FloatingLabel>
			</Form.Group>

			<Form.Group className='mb-3 text-start'>
				<FloatingLabel
					label={
						<>
							<i className='bi bi-envelope-at-fill'></i> Email
						</>
					}
				>
					<Form.Control isInvalid={errors.email} placeholder='gabriel@example.com' autoComplete='username' type='email' {...register("email", { required: true })} />
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
						placeholder='*****'
						id='pass'
						autoComplete='current-password'
						type='password'
						{...register("password", { required: true })}
					/>
					{errors.password && <Form.Control.Feedback type='invalid'>Una contraseña es requerida</Form.Control.Feedback>}
				</FloatingLabel>
			</Form.Group>

			<Container className='mb-3 d-flex justify-content-center'>
				<ReCAPTCHA hl='es' sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} />
			</Container>

			<Button variant='primary' type='submit' disabled={loading || !recaptchaValid}>
				{loading ? (
					<>
						<span className='spinner-border spinner-border-sm' aria-hidden='true'></span>
						<span role='status'> Cargando...</span>
					</>
				) : (
					<>
						<i className='bi bi-person-plus-fill'></i> Registrarse
					</>
				)}
			</Button>
			<p className='text-secondary mt-2'>
				¿Ya tenés una cuenta?{" "}
				<NavLink className='link-underline link-underline-opacity-0' to='/login'>
					Iniciá sesión
				</NavLink>
			</p>
		</Form>
	);
};

export default FirebaseRegister;
