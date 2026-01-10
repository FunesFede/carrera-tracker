import React, { useState } from "react";

import { useAsignaturas } from "../../utils/contexts/AsignaturasContext";
import { useNotas } from "../../utils/contexts/NotasContext";
import asignaturasData from "../../data/asignaturas.json";
import { NavLink } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { CheckCircle, FileCheck, FileX, FolderX, ListChecks, ChevronDown, ChevronRight, AlertTriangle, Pen, ChevronLeft } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Promedio() {
	const { asignaturas } = useAsignaturas();
	const notas = useNotas();
	const [aplazos, setAplazos] = useState(0);

	const faltantes = (asignaturas.aprobadas || []).filter((acrom) => !(acrom in notas));

	const notasArray = Object.values(notas);
	const sumaNotas = notasArray.reduce((acc, nota) => acc + nota, 0);
	const cantidadNotas = notasArray.length;

	const promedio = cantidadNotas > 0 ? (sumaNotas / cantidadNotas).toFixed(2) : 0;
	const promAplazos = aplazos != 0 ? ((sumaNotas + aplazos * 2) / (cantidadNotas + aplazos)).toFixed(2) : promedio;

	const notasDetalle = Object.entries(notas)
		.map(([acrom, nota]) => {
			const asig = asignaturasData.find((a) => a.acronimo === acrom);
			const nombre = asig?.nombre || acrom;
			const anio = asig.anio || 0;
			return { acrom, nombre, nota, anio };
		})
		.sort((a, b) => a.nombre.localeCompare(b.nombre));

	return (
		<div className='space-y-4 mt-4'>
			<div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
				<div className='md:col-span-3 md:order-last'>
					<Card className='bg-emerald-200 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 h-full'>
						<CardContent className='text-center pt-6 pb-6'>
							<CheckCircle className='h-10 w-10 mx-auto text-emerald-600 dark:text-emerald-400' />
							<p className='mt-3 mb-1 text-2xl text-emerald-700 dark:text-emerald-300'>{cantidadNotas}</p>
							<p className='mb-0 text-sm text-muted-foreground'>Asignaturas aprobadas</p>
						</CardContent>
					</Card>
				</div>

				<div className='md:col-span-3'>
					<Card className='bg-blue-200 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 h-full'>
						<CardContent className='text-center pt-6 pb-6'>
							<FileCheck className='h-10 w-10 mx-auto text-blue-600 dark:text-blue-400' />
							<p className='mt-3 mb-1 text-2xl text-blue-700 dark:text-blue-300'>{promedio}</p>
							<p className='mb-0 text-sm text-muted-foreground'>Promedio sin aplazos</p>
						</CardContent>
					</Card>
				</div>

				<div className='md:col-span-3'>
					<Card className='bg-red-200 dark:bg-red-950/30 border-red-300 dark:border-red-800 h-full'>
						<CardContent className='text-center pt-6 pb-6'>
							<FileX className='h-10 w-10 mx-auto text-red-600 dark:text-red-400' />
							<p className='mt-3 mb-1 text-2xl text-red-700 dark:text-red-300'>{aplazos != 0 ? promAplazos : "A Calcular"}</p>
							<p className='mb-0 text-sm text-muted-foreground'>Promedio con aplazos</p>
						</CardContent>
					</Card>
				</div>

				<div className='md:col-span-3'>
					<Card className='bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700 h-full'>
						<CardContent className='text-center pt-6 pb-6'>
							<FolderX className='h-10 w-10 mx-auto text-slate-600 dark:text-slate-400' />
							<Input
								id='inputAplazos'
								defaultValue={0}
								onChange={(e) => setAplazos(Number(e.target.value))}
								className='text-center mt-2 mb-1 h-12 text-lg'
								type='number'
								min={0}
							/>
							<p className='mb-0 text-sm text-muted-foreground'>Cantidad Aplazos</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{asignaturas?.aprobadas.length != Object.values(notas).length && (
				<Alert variant='destructive'>
					<AlertTriangle className='h-4 w-4' />
					<AlertDescription>
						La cantidad de notas no es igual a la cantidad de aprobadas registradas.
						<span className='font-bold'> Esto afecta el cálculo de tu promedio</span>.
					</AlertDescription>
				</Alert>
			)}

			<Card className='bg-card'>
				<CardContent className='pt-6'>
					<Accordion collapsible>
						<AccordionItem value='item-1'>
							<AccordionTrigger className='flex justify-between items-center cursor-pointer'>
								<h5 className='mb-0 flex items-center gap-2'>
									<ListChecks className='h-5 w-5' /> Detalle de Notas
								</h5>
							</AccordionTrigger>
							<AccordionContent className='mt-4'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className='text-center'>Año</TableHead>
											<TableHead className='text-center'>Asignatura</TableHead>
											<TableHead className='text-center'>Nota Final</TableHead>
											<TableHead></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{faltantes.length > 0 &&
											faltantes.map((faltante, index) => {
												const asig = asignaturasData.find((a) => a.acronimo === faltante);
												const nombre = asig?.nombre || faltante;
												const anio = asig?.anio || 0;
												return (
													<TableRow key={index} className='bg-red-900/20'>
														<TableCell>{anio}</TableCell>
														<TableCell>{nombre}</TableCell>
														<TableCell>
															<Badge variant='destructive'>
																<AlertTriangle className='h-3 w-3' />
															</Badge>
														</TableCell>
														<TableCell>
															<NavLink to={`/asignaturas/${faltante}?edit=true`} className='text-primary hover:underline'>
																<Pen className='h-4 w-4' />
															</NavLink>
														</TableCell>
													</TableRow>
												);
											})}

										{notasDetalle.map((asig, index) => {
											return (
												<TableRow key={index}>
													<TableCell>{asig.anio}</TableCell>
													<TableCell>
														<NavLink to={`/asignaturas/${asig.acrom}`}>{asig.nombre}</NavLink>
													</TableCell>
													<TableCell className='normal-nums'>{asig.nota}</TableCell>
													<TableCell>
														<NavLink to={`/asignaturas/${asig.acrom}?edit=true`} className='text-primary hover:underline'>
															<Pen className='h-4 w-4' />
														</NavLink>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
									<TableFooter>
										<TableRow>
											<TableCell></TableCell>
											<TableCell>Cantidad: {cantidadNotas}</TableCell>
											<TableCell>Suma: {sumaNotas}</TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableFooter>
								</Table>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
}
