import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Check, Clock, Lock, Unlock, Info, Trash2 } from "lucide-react";

import { useAsignaturas } from "../utils/contexts/AsignaturasContext.js";
import { useUser } from "../utils/contexts/UserContext.js";
import SetNotaModal from "./modals/SetNotaModal.jsx";

import { esCursable, esHecha } from "../utils/asignaturasHelpers.js";

import { addRegularizada, borraraAsignaturaYDependencias } from "../utils/firebase/asignaturas.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConfirmarAccion } from "./modals/ConfirmarAccion.jsx";

export default function Asignatura({ asignatura }) {
	const navigate = useNavigate();
	const { asignaturas } = useAsignaturas();
	const { user } = useUser();
	const [showModal, setShowModal] = useState(false);

	const hecha = asignaturas ? esHecha(asignaturas, asignatura) : false;
	const cursable = asignaturas ? esCursable(asignaturas, asignatura) : false;
	const aprobada = asignaturas ? asignaturas.aprobadas.includes(asignatura.acronimo) : false;

	const handleIcono = () => {
		if (cursable) {
			if (hecha) {
				if (asignaturas.aprobadas.includes(asignatura.acronimo)) return <Check className='h-5 w-5' />;
				else return <Clock className='h-5 w-5' />;
			} else return <Unlock className='h-5 w-5' />;
		} else return <Lock className='h-5 w-5' />;
	};

	const openModal = () => {
		setShowModal(true);
	};

	const eliminarAsignatura = () => {
		borraraAsignaturaYDependencias(user.uid, asignatura.acronimo);
	};

	const getBgColor = () => {
		if (hecha) {
			return asignaturas.aprobadas.includes(asignatura.acronimo)
				? "bg-emerald-200 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-700"
				: "bg-amber-200 dark:bg-amber-900/30 border-amber-400 dark:border-amber-700";
		}
		return cursable ? "bg-slate-300 dark:bg-slate-700/30 border-slate-400 dark:border-slate-700" : "bg-rose-300 dark:bg-rose-900/30 border-rose-400 dark:border-rose-700";
	};

	return (
		<>
			<SetNotaModal show={showModal} setShow={setShowModal} userId={user.uid} asignatura={asignatura} key={asignatura.acronimo + "NotaModal"} />
			<Card className={cn("mb-3 border-2", getBgColor())}>
				<CardHeader className='pb-3'>
					<CardTitle className='flex flex-col items-center justify-center gap-2 text-center'>
						<div className='flex items-center gap-2'>
							<div>{handleIcono()}</div>
							<div className={aprobada ? "line-through" : ""}>
								<p>{asignatura.nombre}</p>
							</div>
						</div>
						{asignatura.tipo === "Electiva" && (
							<Badge variant='default' className='select-none text-white bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700'>
								Electiva
							</Badge>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex flex-wrap justify-center gap-2'>
						<Button
							variant='default'
							size='sm'
							title='Aprobar Asignatura'
							disabled={!cursable || asignaturas.aprobadas.includes(asignatura.acronimo)}
							className='text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'
							id={asignatura.acronimo + "btnNotaModal"}
							onClick={openModal}
						>
							<Check className='h-4 w-4' />
						</Button>

						<Button
							variant='default'
							size='sm'
							title='Regularizar Asignatura'
							disabled={!cursable || hecha}
							className='text-white bg-amber-300 hover:bg-amber-400 dark:bg-amber-500 dark:hover:bg-amber-600'
							onClick={() => addRegularizada(user.uid, asignatura.acronimo)}
						>
							<Clock className='h-4 w-4' />
						</Button>

						<Button
							variant='default'
							className='text-white bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600'
							size='sm'
							title='Ver Información'
							onClick={() => navigate(`/asignaturas/${asignatura.acronimo}`)}
						>
							<Info className='h-4 w-4' />
						</Button>

						<ConfirmarAccion
							title='¿Eliminar asignatura?'
							description='Asignaturas que dependan de esta serán eliminadas y la nota de exámen final será removida.'
							onConfirm={eliminarAsignatura}
						>
							<Button
								variant='default'
								className='text-white bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600'
								size='sm'
								title='Eliminar Asignatura'
								disabled={!hecha}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</ConfirmarAccion>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
