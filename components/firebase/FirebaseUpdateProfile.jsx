import React, { useContext, useState } from "react";
import { sendPasswordResetEmail, updateEmail, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import UserStateContext from "../../utils/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Camera, Save } from "lucide-react";
import { Spinner } from "../Spinner";

const FirebaseUpdateProfile = () => {
	const user = useContext(UserStateContext);
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isDirty },
		reset,
	} = useForm({
		defaultValues: {
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
		},
	});

	const handleUpdate = async (data) => {
		setLoading(true);
		try {
			await updateProfile(user, { displayName: data?.displayName });
			toast.success("Tu perfil fue actualizado correctamente!");
		} catch (err) {
			console.error("Error al actualizar perfil: ", error);
			let errorMessage = "Ocurrió un error desconocido";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleUpdate)} className='space-y-4'>
			<div className='mb-3'>
				<h3>
					{" "}
					<User className='inline w-5 h-5 mr-1' /> Tu Perfil
				</h3>
				<h5>Configurá tu perfil a tu gusto</h5>
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='email'>
					<Mail className='inline w-4 h-4 mr-1' /> Email {user.emailVerified ? "(Verificado)" : "(No verificado)"}
				</Label>
				<Input id='email' type='email' placeholder='fede@ffede.ar' autoComplete='username' disabled {...register("email")} />
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='name'>
					<User className='inline w-4 h-4 mr-1' /> Nombre
				</Label>
				<Input id='name' type='text' placeholder='Gabriel' autoComplete='name' {...register("displayName")} />
			</div>

			<div className='space-y-2 text-start'>
				<Label htmlFor='photo'>
					<Camera className='inline w-4 h-4 mr-1' /> Foto de Perfil
				</Label>
				<Input id='photo' type='text' placeholder='https://imgur.com/i/perfil.png' disabled {...register("photoURL")} />
			</div>

			<Button type='submit' disabled={loading || !isDirty} className='w-full'>
				{loading ? (
					<>
						<Spinner className='mr-2' />
						Cargando...
					</>
				) : (
					<>
						<Save className='inline w-4 h-4 mr-2' /> Guardar Cambios
					</>
				)}
			</Button>
		</form>
	);
};

export default FirebaseUpdateProfile;
