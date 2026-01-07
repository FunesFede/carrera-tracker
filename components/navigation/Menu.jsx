import React, { useContext, useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { isAdmin } from "../../utils/admin";
import { cn } from "@/lib/utils";
import UserStateContext from "../../utils/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { BarChart3, Building, Calendar, ChevronRight, ExternalLink, Home, Menu, Search, Wrench } from "lucide-react";
import { NavLink } from "react-router";
import { Input } from "@/components/ui/input";

export default function MobileNavBar({ buscar, set }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [universidadOpen, setUniversidadOpen] = useState(false);
	const [horariosOpen, setHorariosOpen] = useState(false);
	const user = useContext(UserStateContext);

	const isActive = (path) => location.pathname === path;

	return (
		<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className=''>
					<Menu className='h-5 w-5' />
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='w-[300px] overflow-y-auto'>
				<SheetHeader>
					<SheetTitle>Menú</SheetTitle>
				</SheetHeader>

				<form role='search' onSubmit={buscar} className='md:hidden flex gap-2 mt-6 items-center'>
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
						onClick={() => setMobileMenuOpen(false)}
						className={cn(
							"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
							isActive("/") ? "bg-accent text-accent-foreground" : "hover:bg-accent",
							!user && "pointer-events-none opacity-50"
						)}
					>
						<Home className='h-4 w-4' />
						Home
					</NavLink>

					<NavLink
						to='/estadisticas'
						onClick={() => setMobileMenuOpen(false)}
						className={cn(
							"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
							isActive("/estadisticas") ? "bg-accent text-accent-foreground" : "hover:bg-accent",
							!user && "pointer-events-none opacity-50"
						)}
					>
						<BarChart3 className='h-4 w-4' />
						Estadísticas
					</NavLink>

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
								Correlativas PDF
								<ExternalLink className='h-3 w-3' />
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

					{isAdmin(user?.uid) && (
						<>
							<Separator />
							<NavLink
								to='/admin'
								onClick={() => setMobileMenuOpen(false)}
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
