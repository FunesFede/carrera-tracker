import asignaturas from "../../data/asignaturas.json";

import GraficoAvance from "./GraficoAvance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, Archive, Hourglass, Info } from "lucide-react";

export default function EstadisticasC({ regularizadas, aprobadas, regularizadasYAprobadas }) {
	return (
		<div className='space-y-4'>
			<Alert className='bg-blue-200 border-blue-300 dark:bg-blue-600/30 dark:border-blue-800'>
				<Info className='h-4 w-4' />
				Los totales y porcentajes solo toman en cuenta 7 electivas.
			</Alert>

			<div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
				<div className='md:col-span-8'>
					<GraficoAvance />
				</div>

				<div className='md:col-span-4 flex flex-col gap-3'>
					<Card className='bg-blue-200 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'>
						<CardContent className='text-center pt-6 pb-6'>
							<Percent className='h-10 w-10 mx-auto text-blue-600 dark:text-blue-400' />
							<p className='mt-3 mb-1 text-2xl font-semibold'>
								{((aprobadas.length * 100) / (asignaturas.filter((a) => a.tipo == "Obligatoria").length + 7)).toFixed(2)}%
							</p>
							<p className='mb-0 text-sm text-muted-foreground'>Completado</p>
						</CardContent>
					</Card>

					<Card className='bg-slate-200 dark:bg-slate-900/30 border-slate-300 dark:border-slate-700'>
						<CardContent className='text-center pt-6 pb-6'>
							<Archive className='h-10 w-10 mx-auto text-slate-600 dark:text-slate-400' />
							<p className='mt-3 mb-1 text-2xl font-semibold text-slate-700 dark:text-slate-300'>{regularizadasYAprobadas.size}</p>
							<p className='mb-0 text-sm text-muted-foreground'>Total Cursadas</p>
						</CardContent>
					</Card>

					<Card className='bg-amber-200 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'>
						<CardContent className='text-center pt-6 pb-6'>
							<Hourglass className='h-10 w-10 mx-auto text-amber-600 dark:text-amber-400' />
							<p className='mt-3 mb-1 text-2xl font-semibold text-amber-700 dark:text-amber-300'>{regularizadas.length}</p>
							<p className='mb-0 text-sm text-muted-foreground'>Asignaturas Regularizadas</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
