import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { Search, Moon, Sun, MoonStar, CloudSun, Rainbow } from "lucide-react";
import { useDarkMode } from "../../utils/hooks/useDarkMode";

import asignaturas from "../../data/asignaturas.json";
import UserStateContext from "../../utils/contexts/UserContext";
import Profile from "../Profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LinksMenu from "./Menu";

export default function NavbarR({ setAsignaturas }) {
	const [query, setQuery] = useState("");

	const navigate = useNavigate();
	const user = useContext(UserStateContext);
	const { isDark, toggleDarkMode } = useDarkMode();

	const buscarAsignatura = (e) => {
		e.preventDefault();

		if ((query == "" || query == " " || !query) && window.location.pathname.includes("asignaturas")) navigate("/home");

		if (!query.trim()) return;
		const lowerQuery = query.toLowerCase();
		const closest =
			asignaturas.find((a) => a.nombre.toLowerCase() === lowerQuery || a.acronimo.toLowerCase() === lowerQuery) ||
			asignaturas.find((a) => a.nombre.toLowerCase().includes(lowerQuery) || a.acronimo.toLowerCase().includes(lowerQuery));
		if (closest) {
			navigate(`/asignaturas/${closest.acronimo}`);
		} else {
			toast.error("No hay resultados para la asignatura buscada, ¿estás escribiendo el acrónimo o nombre correctamente?");
		}
	};

	const handleSaludo = () => {
		const now = new Date();
		const hora = now.getHours();

		if (hora >= 6 && hora < 12)
			return (
				<>
					<CloudSun /> Buenos días
				</>
			);
		if (hora >= 12 && hora < 20)
			return (
				<>
					<Rainbow /> Buenas tardes
				</>
			);
		if (hora >= 20 || hora < 6)
			return (
				<>
					<MoonStar /> Buenas noches
				</>
			);
		else return "👋 Hola";
	};

	return (
		<nav className='sticky top-0 z-50 bg-background border-b px-4 py-2'>
			<div className='container mx-auto flex items-center justify-between gap-4'>
				<div className='flex items-center gap-2'>
					<LinksMenu buscar={buscarAsignatura} set={setQuery} />
					<NavLink to={user ? "/home" : "/"} className='flex items-center'>
						<img src={isDark ? "/images/logo.png" : "/images/logo-dark.png"} alt='Logo' width='100' height='30' className='inline-block' />
					</NavLink>
				</div>

				<h4 className='hidden md:flex gap-2'>
					{handleSaludo()}, {user?.displayName ? user.displayName + "." : "como estás hoy?"}
				</h4>

				<div className='flex items-center gap-2'>
					<form role='search' onSubmit={buscarAsignatura} className='hidden md:flex items-center gap-2'>
						<Input
							type='search'
							placeholder='Buscar Asignatura...'
							aria-label='Buscar Asignatura'
							onChange={(e) => setQuery(e.target.value)}
							disabled={!user}
							className='w-48'
						/>
						<Button variant='outline' type='submit' size='icon' disabled={!user}>
							<Search className='h-4 w-4' />
						</Button>
					</form>
					<Button variant='outline' size='icon' onClick={toggleDarkMode} title={isDark ? "Modo Claro" : "Modo Oscuro"}>
						{isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
					</Button>
					<Profile setAsignaturas={setAsignaturas} />
				</div>
			</div>
		</nav>
	);
}
