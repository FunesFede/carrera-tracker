import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, ArrowRight, ChartPie, Heart, LibraryBig, Plus, UserStar } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";
import TypewriterComponent from "typewriter-effect";

export default function Landing() {
	return (
		<>
			<div className='bg-background'>
				<div className='relative isolate px-6 mt-14 lg:px-8'>
					<div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
						<div className='text-center'>
							<h1 className='text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl dark:text-white'>
								Seguir tu progreso de la carrera hecho{" "}
								<TypewriterComponent
									options={{
										strings: ["más fácil", "sin estrés", "más organizado", "bajo control", "más claro", "sin complicaciones", "a tu alcance"],
										autoStart: true,
										loop: true,
									}}
								/>
							</h1>
							<p className='mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8 dark:text-gray-400'>
								Mantené el control de tu carrera. Registrá tus materias, visualiza tu progreso y planifica tu camino hacia el título de forma clara y organizada.
							</p>
							<div className='mt-10 flex items-center justify-center gap-x-6'>
								<Button asChild>
									<NavLink to='/register'>
										<Plus /> Registrarme
									</NavLink>
								</Button>
								<Button asChild variant='secondary'>
									<a href='#features'>
										<Heart /> Conocer Más
									</a>
								</Button>
							</div>
						</div>
					</div>
					<div aria-hidden='true' className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
						<div className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'></div>
					</div>
				</div>
			</div>

			<div id='features' className='bg-background py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:text-center'>
						<h2 className='text-base/7 font-semibold text-indigo-600 dark:text-indigo-400'>Organizate mejor</h2>
						<p className='mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance dark:text-white'>
							Todo lo que necesitas para trackear tu progreso
						</p>
						<p className='mt-6 text-lg/8 text-gray-700 dark:text-gray-300'>
							Llevá una mejor organización de tu carrera. Revisá correlatividades, dependencias, promedios, progreso y mucho más.
						</p>
					</div>
					<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
						<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
							<div className='relative pl-16'>
								<dt className='text-base/7 font-semibold text-gray-900 dark:text-white'>
									<div className='text-white absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500'>
										<LibraryBig />
									</div>
									Plan de Estudio
								</dt>
								<dd className='mt-2 text-base/7 text-gray-600 dark:text-gray-400'>
									Seguí el plan de estudio actualizado de la carrera. Visualizá todas las asignaturas: anuales, cuatrimestrales, obligatorias y electivas.
								</dd>
							</div>
							<div className='relative pl-16'>
								<dt className='text-base/7 font-semibold text-gray-900 dark:text-white'>
									<div className='text-white absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500'>
										<ArrowLeftRight />
									</div>
									Correlativas y dependientes
								</dt>
								<dd className='mt-2 text-base/7 text-gray-600 dark:text-gray-400'>
									LLevá el monitoreo de qué asignaturas podes cursar, que necesitas para cursar, y en qué otras asignaturas esta es dependiente.
								</dd>
							</div>
							<div className='relative pl-16'>
								<dt className='text-base/7 font-semibold text-gray-900 dark:text-white'>
									<div className='text-white absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500'>
										<ChartPie />
									</div>
									Estadísticas
								</dt>
								<dd className='mt-2 text-base/7 text-gray-600 dark:text-gray-400'>
									Dale un ojo a tu progreso general. Visualizá tu cantidad de asignaturas aprobadas, regularizadas, tu porcentaje completado, y tu promedio en un
									solo lugar de forma simple.
								</dd>
							</div>
							<div className='relative pl-16'>
								<dt className='text-base/7 font-semibold text-gray-900 dark:text-white'>
									<div className='text-white absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500'>
										<UserStar />
									</div>
									Valorá comisiones{" "}
									<Badge className='text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 select-none'>Muy pronto!</Badge>
								</dt>
								<dd className='mt-2 text-base/7 text-gray-600 dark:text-gray-400'>
									Revisá las mejores comisiones para cursar con valoraciones hechas por los mismos usuarios. Mejorá tu cursada sabiendo que elegiste la mejor
									comisión.
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</>
	);
}
