import React, { useContext } from "react";
import UserStateContext from "../utils/contexts/UserContext";

import { auth } from "../firebase/config";
import { sendEmailVerification, signOut } from "firebase/auth";
import { NavLink, useNavigate } from "react-router";

import { User, Settings, Mail, MailCheck, MailWarning, LogOut, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Profile({ setAsignaturas }) {
	const user = useContext(UserStateContext);
	const navigate = useNavigate();

	const handleCerrarSession = () => {
		if (user) {
			signOut(auth)
				.catch(() => console.debug("Failed to sign out"))
				.then(() => setAsignaturas(null));
		} else navigate("/login");
	};

	const handleVerifiacionEmail = async () => {
		try {
			await sendEmailVerification(user);
			toast.success("Verificación de email enviada correctamente.");
		} catch (error) {
			console.error("Error al enviar verificacion email: ", error);
			toast.error("Algo salió mal al intentar enviar la verificación de email.");
		}
	};

	return (
		<DropdownMenu>
			{user ? (
				<DropdownMenuTrigger asChild>
					<Button variant='default' size='sm' className='gap-2'>
						<User className='h-4 w-4' />
						Perfil
					</Button>
				</DropdownMenuTrigger>
			) : (
				<Button variant='default' size='sm' asChild>
					<NavLink to='/login' className='gap-2'>
						<ArrowRight className='h-4 w-4' /> Iniciar Sesión
					</NavLink>
				</Button>
			)}
			<DropdownMenuContent align='end'>
				<DropdownMenuItem disabled={!user} onClick={() => navigate("/profile/settings")}>
					<Settings className='mr-2 h-4 w-4' />
					Configuración
				</DropdownMenuItem>

				<DropdownMenuItem disabled={!user || user?.emailVerified} onClick={handleVerifiacionEmail}>
					{user ? user.emailVerified ? <MailCheck className='mr-2 h-4 w-4' /> : <MailWarning className='mr-2 h-4 w-4' /> : <Mail className='mr-2 h-4 w-4' />}
					Verificación Email {user ? (user.emailVerified ? "(Verificado)" : "(No verificado)") : ""}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={handleCerrarSession}>
					{user ? (
						<>
							<LogOut className='mr-2 h-4 w-4' />
							Cerrar Sesión
						</>
					) : (
						<>
							<LogIn className='mr-2 h-4 w-4' />
							Iniciar Sesión
						</>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
