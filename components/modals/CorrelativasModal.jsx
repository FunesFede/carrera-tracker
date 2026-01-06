import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

import asignaturasData from "../../data/asignaturas.json";

export default function CorrelativasModal({ asignatura, open, onOpenChange }) {
	const navigate = useNavigate();
	const regularizadas =
		asignatura.regularizadas.length > 0
			? asignatura.regularizadas.map((acron) => {
					return asignaturasData.find((a) => a.acronimo == acron).nombre;
			  })
			: ["No requiere asignaturas regularizadas."];
	const aprobadas =
		asignatura.aprobadas.length > 0
			? asignatura.aprobadas.map((acron) => {
					return asignaturasData.find((a) => a.acronimo == acron).nombre;
			  })
			: ["No requiere asignaturas aprobadas."];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<ArrowLeftRight className='inline w-5 h-5 mr-1' /> Correlativas de {asignatura.nombre}
					</DialogTitle>
				</DialogHeader>
				<div className='space-y-2'>
					<p>
						<span className='font-bold'>Regularizadas (o aprobadas): </span>
						{regularizadas.join(", ")}
					</p>
					<p>
						<span className='font-bold'>Aprobadas: </span>
						{aprobadas.join(", ")}
					</p>
				</div>
				<DialogFooter>
					<Button
						onClick={() => {
							onOpenChange(false);
							navigate("/asignaturas/" + asignatura.acronimo);
						}}
					>
						<ArrowRight className='inline w-4 h-4 mr-1' /> Más Información
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
