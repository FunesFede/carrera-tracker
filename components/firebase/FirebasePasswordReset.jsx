import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, KeyRound, DoorOpen } from "lucide-react";
import Spinner from "../Spinner.jsx";

const FirebasePasswordReset = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [done, setDone] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const handleAuth = async (data) => {
		setLoading(true);
		try {
			await sendPasswordResetEmail(auth, data.email);
			toast.success("Email para reestablecer contraseña enviado correctamente!");
			setDone(true);
		} catch (err) {
			let errorMessage = "Ocurrió un error desconocido. " + err.code;
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleAuth)} className='space-y-6'>
			<div className='mb-3 text-center'>
				<h3 className='text-2xl font-semibold flex items-center justify-center gap-2'>
					<Lock className='w-5 h-5' />
					Reestablecé tu contraseña
				</h3>
				<h4 className='text-xl mt-2'>Recibirás un mail para reestablecerla</h4>
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='email'>
					<Mail className='inline w-4 h-4 mr-1' /> Email
				</Label>
				<Input
					id='email'
					type='email'
					placeholder='email@example.com'
					autoComplete='username'
					className={errors.email ? "border-destructive" : ""}
					disabled={done}
					{...register("email", { required: true })}
				/>
				{errors.email && <p className='text-sm text-destructive'>Un email es requerido</p>}
			</div>
			{!done ? (
				<Button type='submit' disabled={loading} className='w-full'>
					{loading ? (
						<>
							<Spinner className='mr-2' />
							Cargando...
						</>
					) : (
						<>
							<KeyRound className='inline w-4 h-4 mr-2' /> Reestablecer Contraseña
						</>
					)}
				</Button>
			) : (
				<Button type='button' onClick={() => navigate("/login")} className='w-full'>
					<DoorOpen className='inline w-4 h-4 mr-2' /> Volver al login
				</Button>
			)}
			<p className='text-muted-foreground mt-1 text-center'>
				¿Tenés una cuenta?{" "}
				<NavLink className='text-primary hover:underline' to='/login'>
					Iniciá Sesión
				</NavLink>
			</p>
			<p className='text-muted-foreground text-center'>
				¿No tenés una cuenta?{" "}
				<NavLink className='text-primary hover:underline' to='/register'>
					Registrate
				</NavLink>
			</p>
		</form>
	);
};

export default FirebasePasswordReset;
