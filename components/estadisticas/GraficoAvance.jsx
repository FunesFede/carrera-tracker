import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

import { useAsignaturas } from "../../utils/contexts/AsignaturasContext.js";
import asignaturasData from "../../data/asignaturas.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
	aprobadas: "hsl(160, 84%, 39%)", // emerald-600
	regularizadas: "hsl(38, 92%, 50%)", // amber-500
	pendientes: "hsl(215, 16%, 47%)", // slate-500
};

export default function GraficoAvance() {
	const { asignaturas } = useAsignaturas();

	if (!asignaturas) {
		return null;
	}

	const totalObligatorias = asignaturasData.filter((a) => a.tipo == "Obligatoria").length;
	const totalAsignaturas = totalObligatorias + 7; // Total de la carrera

	const aprobadasCount = asignaturas.aprobadas.length;

	const regularizadasYAprobadas = new Set([...asignaturas.regularizadas, ...asignaturas.aprobadas]);
	const cursadasCount = regularizadasYAprobadas.size;

	const regularizadasSoloCount = asignaturas.regularizadas.length;

	const pendientesCount = totalAsignaturas - cursadasCount;

	const data = [
		{ name: "Aprobadas", value: aprobadasCount, color: COLORS.aprobadas },
		{ name: "Regularizadas", value: regularizadasSoloCount, color: COLORS.regularizadas },
		{ name: "A Cursar", value: pendientesCount, color: COLORS.pendientes },
	];

	const renderCustomLabel = (entry) => {
		return entry.value;
	};

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardTitle className='text-lg font-semibold'>Progreso</CardTitle>
			</CardHeader>
			<CardContent className='relative'>
				<ResponsiveContainer width='100%' height={400}>
					<PieChart>
						<Pie
							data={data}
							cx='50%'
							cy='50%'
							labelLine={false}
							label={renderCustomLabel}
							outerRadius={120}
							fill='#8884d8'
							dataKey='value'
							style={{ fontSize: "14px", fontWeight: "600", outline: "none" }}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} style={{ outline: "none" }} />
							))}
						</Pie>
						<Legend wrapperStyle={{ fontSize: "14px" }} />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
