import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router";

import asignaturasData from "../data/asignaturas.json";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import UserStateContext from "../utils/contexts/UserContext.js";

import { esCursable, esHecha } from "../utils/asignaturasHelpers.js";

import SetNotaModal from "../components/modals/SetNotaModal.jsx";
import NotasContext from "../utils/contexts/NotasContext.js";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Hourglass, Unlock, Lock, ArrowLeftRight, Link2, Pen, FilePlus, ArrowLeft } from "lucide-react";

export default function AsignaturaInfo() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { acrom } = useParams();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const asignaturas = useContext(AsignaturasContext);
	const notas = useContext(NotasContext);
	const user = useContext(UserStateContext);

	useEffect(() => {
		const edit = Boolean(searchParams.get("edit"));
		if (edit) {
			handleAddNota();
			setSearchParams({}, { replace: true });
		}
	}, [searchParams, setSearchParams]);

	let asignatura = asignaturasData.filter((asign) => asign.acronimo == acrom.toUpperCase())[0];
	if (!asignatura) {
		asignatura = {
			nombre: "Asignatura No Encontrada",
			anio: 0,
			acronimo: "?",
			tipo: "?",
			duracion: "?",
			aprobadas: [],
			regularizadas: [],
		};
	}

	const nota = notas[asignatura.acronimo];

	const hecha = esHecha(asignaturas, asignatura);
	const cursable = esCursable(asignaturas, asignatura);
	const aprobada = asignaturas.aprobadas.includes(asignatura.acronimo);

	const asignRegularizadas = asignaturasData.filter((asign) => asignatura.regularizadas.includes(asign.acronimo));
	const asignAprobadas = asignaturasData.filter((asign) => asignatura.aprobadas.includes(asign.acronimo));
	const correlativaFuturaRegular = asignaturasData.filter((asign) => asign.regularizadas.includes(asignatura.acronimo));
	const correlativaFuturaAprobada = asignaturasData.filter((asign) => asign.aprobadas.includes(asignatura.acronimo));
	const correlativaFutura = [...correlativaFuturaAprobada, ...correlativaFuturaRegular].sort((a, b) => a.nombre.localeCompare(b.nombre));

	const handleEstado = () => {
		if (cursable) {
			if (hecha) {
				if (aprobada)
					return (
						<span className='text-success'>
							<Check className='inline w-4 h-4 mr-1' /> Aprobada
						</span>
					);
				else
					return (
						<span className='text-warning'>
							<Hourglass className='inline w-4 h-4 mr-1' /> Regularizada
						</span>
					);
			} else
				return (
					<span>
						<Unlock className='inline w-4 h-4 mr-1' /> Cursable
					</span>
				);
		} else
			return (
				<span className='text-danger'>
					<Lock className='inline w-4 h-4 mr-1' /> No Cursable
				</span>
			);
	};

	const handleColor = (asig) => {
		if (esCursable(asignaturas, asig)) {
			if (esHecha(asignaturas, asig)) {
				if (asignaturas.aprobadas.includes(asig.acronimo)) return "text-success";
				else return "text-warning";
			} else return "";
		} else return "text-danger";
	};

	const handleAnio = () => {
		switch (asignatura.anio) {
			case 1:
				return "Primero";
			case 2:
				return "Segundo";
			case 3:
				return "Tercero";
			case 4:
				return "Cuarto";
			case 5:
				return "Quinto";
			default:
				return asignatura.anio;
		}
	};

	const handleAddNota = () => {
		setShowModal(true);
	};

	return (
		<>
			<SetNotaModal show={showModal} setShow={setShowModal} aNota={nota} userId={user.uid} asignatura={asignatura} key={asignatura.acronimo + "NotaModal"} />

			<div className='flex flex-col flex-grow justify-center my-4'>
				<div className='w-responsive mx-auto px-4'>
					<Breadcrumb className='mb-4'>
						<BreadcrumbList>
							<BreadcrumbItem>
								<NavLink className='hover:underline' to='/'>
									Home
								</NavLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>Asignaturas</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>{asignatura.nombre}</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<Card>
						<CardHeader>
							<CardTitle className='text-2xl'>{asignatura.nombre}</CardTitle>
							<CardDescription>
								<span className='font-bold'>Año: </span> {handleAnio()},<span className='font-bold'> Tipo: </span>
								{asignatura.tipo},<span className='font-bold'> Duración: </span>
								{asignatura.duracion},<span className='font-bold'> Acrónimo: </span>
								{asignatura.acronimo}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className=' border-t border-border pt-4'>
								<span className='font-bold'>Estado:</span> {handleEstado()}{" "}
								{nota ? (
									<>
										{" "}
										| <span className='font-bold'>Nota final:</span> {nota}{" "}
										<span className='cursor-pointer text-primary hover:underline' onClick={handleAddNota} id={asignatura.acronimo + "NotaModal"}>
											<Pen className='inline w-4 h-4' />
										</span>
									</>
								) : aprobada ? (
									<>
										{" "}
										| <span className='font-bold'>Nota final:</span>{" "}
										<span className='cursor-pointer text-primary hover:underline' onClick={handleAddNota}>
											<FilePlus className='inline w-4 h-4 mr-1' /> Añadir
										</span>
									</>
								) : (
									""
								)}
							</div>
							<div className='border-t border-border pt-4'>
								<div className='font-bold'>
									<span>
										<ArrowLeftRight className='inline w-4 h-4 mr-1' /> Correlativas
									</span>
								</div>
								<div>
									<span className='font-semibold'>Regularizadas:</span>{" "}
									{asignatura.regularizadas.length > 0
										? asignRegularizadas.map((a, idx) => (
												<React.Fragment key={a.acronimo}>
													<span className={handleColor(a)}>{a.nombre}</span>
													{idx < asignRegularizadas.length - 1 ? ", " : ""}
												</React.Fragment>
										  ))
										: "No requiere asignaturas regularizadas"}
								</div>
								<div>
									<span className='font-semibold'>Aprobadas:</span>{" "}
									{asignatura.aprobadas.length > 0
										? asignAprobadas.map((a, idx) => (
												<React.Fragment key={a.acronimo}>
													<span className={handleColor(a)}>{a.nombre}</span>
													{idx < asignAprobadas.length - 1 ? ", " : ""}
												</React.Fragment>
										  ))
										: "No requiere asignaturas aprobadas"}
								</div>
							</div>
							<div className='border-t border-border pt-4'>
								<div className='font-bold'>
									<span>
										<Link2 className='inline w-4 h-4 mr-1' /> Dependiente En
									</span>
								</div>
								<div>
									<span className='font-semibold'>Como regularizada:</span>{" "}
									{correlativaFuturaRegular.length > 0
										? correlativaFuturaRegular.map((a, idx) => (
												<React.Fragment key={a.acronimo}>
													<span className={handleColor(a)}>{a.nombre}</span>
													{idx < correlativaFuturaRegular.length - 1 ? ", " : ""}
												</React.Fragment>
										  ))
										: "No es dependiente como regular"}
								</div>
								<div>
									<span className='font-semibold'>Como aprobada:</span>{" "}
									{correlativaFuturaAprobada.length > 0
										? correlativaFuturaAprobada.map((a, idx) => (
												<React.Fragment key={a.acronimo}>
													<span className={handleColor(a)}>{a.nombre}</span>
													{idx < correlativaFuturaAprobada.length - 1 ? ", " : ""}
												</React.Fragment>
										  ))
										: "No es dependiente como aprobada"}
								</div>
							</div>
						</CardContent>
						<CardFooter className='flex flex-col gap-2'>
							<Select
								onValueChange={(value) => value != "-1" && navigate(`/asignaturas/${value}`)}
								disabled={asignAprobadas.length == 0 && asignRegularizadas.length == 0}
								defaultValue='-1'
							>
								<SelectTrigger>
									<SelectValue>{asignAprobadas.length == 0 && asignRegularizadas.length == 0 ? "No hay correlativas" : "Visitar correlativa"}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{[...asignRegularizadas, ...asignAprobadas]
										.toSorted((a, b) => a.nombre.localeCompare(b.nombre))
										.map((asign, index) => (
											<SelectItem key={index} value={asign.acronimo}>
												{asign.nombre}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
							<Select onValueChange={(value) => value != "-1" && navigate(`/asignaturas/${value}`)} disabled={correlativaFutura.length == 0} defaultValue='-1'>
								<SelectTrigger>
									<SelectValue>{correlativaFutura.length == 0 ? "No hay dependientes" : "Visitar Dependiente"}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{correlativaFutura.map((asign, index) => (
										<SelectItem key={index} value={asign.acronimo}>
											{asign.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Button onClick={() => navigate(-1)} className='w-full'>
								<ArrowLeft className='inline w-4 h-4 mr-2' /> Volver
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
