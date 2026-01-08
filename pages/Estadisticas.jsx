import React, { useContext } from "react";
import { BarChart3 } from "lucide-react";

import Totales from "../components/estadisticas/Totales.jsx";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import Promedio from "../components/estadisticas/Promedio.jsx";

export default function Estadisticas() {
	const asignaturas = useContext(AsignaturasContext);

	let regularizadas = asignaturas ? asignaturas.regularizadas : [];
	let aprobadas = asignaturas ? asignaturas.aprobadas : [];

	const regularizadasYAprobadas = new Set([...regularizadas, ...aprobadas]);

	return (
		<div className='py-8 bg-background flex flex-1 flex-grow '>
			<div className='container mx-auto px-4'>
				<h3 className='text-start text-3xl font-semibold mb-6 flex items-center gap-2'>
					<BarChart3 className='h-8 w-8' />
					Tus Estadísticas
				</h3>
				<Totales aprobadas={aprobadas} regularizadas={regularizadas} regularizadasYAprobadas={regularizadasYAprobadas} />
				<Promedio />
			</div>
		</div>
	);
}
