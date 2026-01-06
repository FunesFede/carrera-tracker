import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Home, BarChart3, Search, Building, Calendar, Wrench, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../utils/hooks/useDarkMode";

import asignaturas from "../../data/asignaturas.json";
import UserStateContext from "../../utils/contexts/UserContext";
import Profile from "../Profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { isAdmin } from "../../utils/admin";

export default function NavbarR({ setAsignaturas }) {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const user = useContext(UserStateContext);
	const { isDark, toggleDarkMode } = useDarkMode();

	const buscarAsignatura = (e) => {
		e.preventDefault();

		if ((query == "" || query == " " || !query) && window.location.pathname.includes("asignaturas")) navigate("/");

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

	return (
		<nav className='sticky top-0 z-50 bg-background border-b px-4 py-2'>
			<div className='container mx-auto flex items-center justify-between gap-4'>
				<NavLink to='/' className='flex items-center'>
					<img src={isDark ? "/images/logo.png" : "/images/logo-dark.png"} alt='Logo' width='100' height='30' className='inline-block' />
				</NavLink>

				<div className='hidden lg:flex items-center gap-4 flex-1 justify-center'>
					<NavLink
						to='/'
						className={({ isActive }) =>
							`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
							} ${!user ? "pointer-events-none opacity-50" : ""}`
						}
					>
						<Home className='h-4 w-4' />
						Home
					</NavLink>

					<NavLink
						to='/estadisticas'
						className={({ isActive }) =>
							`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
							} ${!user ? "pointer-events-none opacity-50" : ""}`
						}
					>
						<BarChart3 className='h-4 w-4' />
						Estadísticas
					</NavLink>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='sm' className='gap-2'>
								<Building className='h-4 w-4' />
								Universidad
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem asChild>
								<a href='https://a4.frc.utn.edu.ar' target='_blank' rel='noopener noreferrer' className='cursor-pointer'>
									Autogestión
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='https://uv.frc.utn.edu.ar' target='_blank' rel='noopener noreferrer' className='cursor-pointer'>
									Aula Virtual
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='https://www.institucional.frc.utn.edu.ar/sistemas/' target='_blank' rel='noopener noreferrer' className='cursor-pointer'>
									Departamento de Sistemas
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='https://seu.frc.utn.edu.ar/?pIs=1286' target='_blank' rel='noopener noreferrer' className='cursor-pointer'>
									Pasantías
								</a>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<a href='/docs/correlativas.pdf' target='_blank' rel='noopener noreferrer' className='cursor-pointer'>
									Correlativas PDF
								</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='sm' className='gap-2'>
								<Calendar className='h-4 w-4' />
								Horarios
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem asChild>
								<a href='/docs/horarios/primero.pdf' target='_blank' className='cursor-pointer'>
									Primer Año
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='/docs/horarios/segundo.pdf' target='_blank' className='cursor-pointer'>
									Segundo Año
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='/docs/horarios/tercero.pdf' target='_blank' className='cursor-pointer'>
									Tercer Año
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='/docs/horarios/cuarto.pdf' target='_blank' className='cursor-pointer'>
									Cuarto Año
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href='/docs/horarios/quinto.pdf' target='_blank' className='cursor-pointer'>
									Quinto Año
								</a>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<a href='/docs/horarios/seminario.pdf' target='_blank' className='cursor-pointer'>
									Seminario
								</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{isAdmin(user?.uid) && (
						<NavLink
							to='/admin'
							className={({ isActive }) =>
								`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
									isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								}`
							}
						>
							<Wrench className='h-4 w-4' />
							Admin
						</NavLink>
					)}
				</div>

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
					</form>{" "}
					<Button variant='outline' size='icon' onClick={toggleDarkMode} title={isDark ? "Modo Claro" : "Modo Oscuro"}>
						{isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
					</Button>{" "}
					<Profile setAsignaturas={setAsignaturas} />
				</div>
			</div>
		</nav>
	);
}
