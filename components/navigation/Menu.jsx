import React, { useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { isAdmin } from "../../utils/admin";
import { cn } from "@/lib/utils";
import { useUser } from "../../utils/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { BarChart3, Building, Calendar, ChevronRight, CloudSun, ExternalLink, Home, Menu, MoonStar, PlaneLanding, Rainbow, Search, UserStar, Wrench } from "lucide-react";
import { NavLink } from "react-router";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MobileNavBar({ buscar, set }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [universidadOpen, setUniversidadOpen] = useState(false);
	const [horariosOpen, setHorariosOpen] = useState(false);
	const { user } = useUser();

	const isActive = (path) => location.pathname === path;

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
		<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className=''>
					<Menu className='h-5 w-5' />
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='w-[300px] overflow-y-auto'>
				<SheetHeader>
					<SheetTitle>Menú</SheetTitle>
					<SheetDescription className='flex md:hidden gap-2'>
						{handleSaludo()}, {user?.displayName ? user.displayName : "como estás hoy?"}
					</SheetDescription>
				</SheetHeader>

				<form role='search' onSubmit={(e) => buscar(e, setMenuOpen)} className='md:hidden flex gap-2 mt-6 items-center'>
					<Input
						type='search'
						placeholder='Buscar Asignatura...'
						aria-label='Buscar Asignatura'
						onChange={(e) => set(e.target.value)}
						disabled={!user}
						className='w-48'
					/>
					<Button variant='outline' type='submit' size='icon' disabled={!user}>
						<Search className='h-4 w-4' />
					</Button>
				</form>

				<div className='flex flex-col gap-4 mt-6'>
					<NavLink
						to='/home'
						onClick={() => setMenuOpen(false)}
						className={cn(
							"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
							isActive("/home") ? "bg-accent text-accent-foreground" : "hover:bg-accent",
							!user && "pointer-events-none opacity-50"
						)}
					>
						<Home className='h-4 w-4' />
						Home
					</NavLink>

					<NavLink
						to='/estadisticas'
						onClick={() => setMenuOpen(false)}
						className={cn(
							"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
							isActive("/estadisticas") ? "bg-accent text-accent-foreground" : "hover:bg-accent",
							!user && "pointer-events-none opacity-50"
						)}
					>
						<BarChart3 className='h-4 w-4' />
						Estadísticas
					</NavLink>

					<div className='flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors '>
						<NavLink to='/valorar' className='flex items-center gap-2 opacity-50 pointer-events-none'>
							<UserStar className='h-4 w-4' />
							Valorar Comisiones{" "}
						</NavLink>
						<Badge className='text-white text-center bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 select-none'>Pronto</Badge>
					</div>

					<Separator />

					<Collapsible open={universidadOpen} onOpenChange={setUniversidadOpen}>
						<CollapsibleTrigger className='flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent'>
							<div className='flex items-center gap-2'>
								<Building className='h-4 w-4' />
								Universidad
							</div>
							<ChevronRight className={cn("h-4 w-4 transition-transform", universidadOpen && "rotate-90")} />
						</CollapsibleTrigger>
						<CollapsibleContent className='flex flex-col gap-1 mt-2 ml-6'>
							<a
								href='https://a4.frc.utn.edu.ar'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent'
							>
								Autogestión
								<ExternalLink className='h-3 w-3' />
							</a>
							<a
								href='https://uv.frc.utn.edu.ar'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent'
							>
								Aula Virtual
								<ExternalLink className='h-3 w-3' />
							</a>
							<a
								href='https://www.institucional.frc.utn.edu.ar/sistemas/'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent'
							>
								Departamento de Sistemas
								<ExternalLink className='h-3 w-3' />
							</a>
							<a
								href='https://seu.frc.utn.edu.ar/?pIs=1286'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent'
							>
								Pasantías
								<ExternalLink className='h-3 w-3' />
							</a>
							<Separator />
							<a
								href='/docs/correlativas.pdf'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent'
							>
								PDF Correlativas
							</a>
						</CollapsibleContent>
					</Collapsible>

					<Collapsible open={horariosOpen} onOpenChange={setHorariosOpen}>
						<CollapsibleTrigger className='flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent'>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4' />
								Horarios
							</div>
							<ChevronRight className={cn("h-4 w-4 transition-transform", horariosOpen && "rotate-90")} />
						</CollapsibleTrigger>
						<CollapsibleContent className='flex flex-col gap-1 mt-2 ml-6'>
							<a href='/docs/horarios/primero.pdf' target='_blank' className='px-3 py-2 text-sm rounded-md hover:bg-accent'>
								Primer Año
							</a>
							<a href='/docs/horarios/segundo.pdf' target='_blank' className='px-3 py-2 text-sm rounded-md hover:bg-accent'>
								Segundo Año
							</a>
							<a href='/docs/horarios/tercero.pdf' target='_blank' className='px-3 py-2 text-sm rounded-md hover:bg-accent'>
								Tercer Año
							</a>
							<a href='/docs/horarios/cuarto.pdf' target='_blank' className='px-3 py-2 text-sm rounded-md hover:bg-accent'>
								Cuarto Año
							</a>
							<a href='/docs/horarios/quinto.pdf' target='_blank' className='px-3 py-2 text-sm rounded-md hover:bg-accent'>
								Quinto Año
							</a>
							<Separator />
							<a href='/docs/horarios/seminario.pdf' target='_blank' className='px-3 py-2 text-sm rounded-md hover:bg-accent'>
								Seminario
							</a>
						</CollapsibleContent>
					</Collapsible>

					<Separator />
					<NavLink
						to='/'
						onClick={() => setMenuOpen(false)}
						className={cn(
							"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
							isActive("/") ? "bg-accent text-accent-foreground" : "hover:bg-accent"
						)}
					>
						<PlaneLanding className='h-4 w-4' />
						Landing Page
					</NavLink>

					{isAdmin(user?.uid) && (
						<>
							<Separator />
							<NavLink
								to='/admin'
								onClick={() => setMenuOpen(false)}
								className={cn(
									"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
									isActive("/admin") ? "bg-accent text-accent-foreground" : "hover:bg-accent"
								)}
							>
								<Wrench className='h-4 w-4' />
								Admin
							</NavLink>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
