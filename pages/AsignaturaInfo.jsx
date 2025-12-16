import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router";

import asignaturasData from "../data/asignaturas.json";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import UserStateContext from "../utils/contexts/UserContext.js";

import { esCursable, esHecha } from "../utils/asignaturasHelpers.js";

import SetNotaModal from "../components/modals/SetNotaModal.jsx";
import NotasContext from "../utils/contexts/NotasContext.js";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import BreadcrumbItem from "react-bootstrap/BreadcrumbItem";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Stack } from "react-bootstrap";

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
							<i className='bi bi-check-lg'></i> Aprobada
						</span>
					);
				else
					return (
						<span className='text-warning'>
							<i className='bi bi-hourglass'></i> Regularizada
						</span>
					);
			} else
				return (
					<span>
						<i className='bi bi-unlock-fill'></i> Cursable
					</span>
				);
		} else
			return (
				<span className='text-danger'>
					<i className='bi bi-lock-fill'></i> No Cursable
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

			<Container fluid className='d-flex flex-column flex-grow-1 justify-content-center my-4'>
				<Container fluid className='w-responsive'>
					<Breadcrumb aria-label='breadcrumb'>
						<NavLink className='breadcrumb-item' to='/'>
							Home
						</NavLink>
						<BreadcrumbItem active>Asignaturas</BreadcrumbItem>
						<BreadcrumbItem active>{asignatura.nombre}</BreadcrumbItem>
					</Breadcrumb>

					<Card className='bg-dark-custom'>
						<Card.Body>
							<Card.Title className='mb-0 pb-0'>
								<h2>{asignatura.nombre}</h2>
								<Card.Subtitle>
									<span className='fw-bold'>Año: </span> {handleAnio()},<span className='fw-bold'> Tipo: </span>
									{asignatura.tipo},<span className='fw-bold'> Duración: </span>
									{asignatura.duracion},<span className='fw-bold'> Acrónimo: </span>
									{asignatura.acronimo}
								</Card.Subtitle>
							</Card.Title>
							<Card.Text as='div' className='mt-1'>
								<ListGroup variant='flush'>
									<ListGroupItem key='1' className='bg-dark-custom'>
										<span className='fw-bold'>Estado:</span> {handleEstado()}{" "}
										{nota ? (
											<>
												{" "}
												| <span className='fw-bold'>Nota final:</span> {nota}{" "}
												<span className='clickable link link-primary' onClick={handleAddNota} id={asignatura.acronimo + "NotaModal"}>
													<i className='bi bi-pen'></i>
												</span>
											</>
										) : aprobada ? (
											<>
												{" "}
												| <span className='fw-bold'>Nota final:</span>{" "}
												<span className='clickable link-primary link-underline link-underline-opacity-0' onClick={handleAddNota}>
													<i className='bi bi-file-earmark-plus'></i> Añadir
												</span>
											</>
										) : (
											""
										)}
									</ListGroupItem>
									<ListGroupItem key='2' className='bg-dark-custom'>
										<div className='fw-bold'>
											<span>
												<i className='bi bi-arrow-left-right'></i> Correlativas
											</span>
										</div>
										<div>
											<span className='fw-semibold'>Regularizadas:</span>{" "}
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
											<span className='fw-semibold'>Aprobadas:</span>{" "}
											{asignatura.aprobadas.length > 0
												? asignAprobadas.map((a, idx) => (
														<React.Fragment key={a.acronimo}>
															<span className={handleColor(a)}>{a.nombre}</span>
															{idx < asignAprobadas.length - 1 ? ", " : ""}
														</React.Fragment>
												  ))
												: "No requiere asignaturas aprobadas"}
										</div>
									</ListGroupItem>
									<ListGroupItem key='4' className='bg-dark-custom'>
										<div className='fw-bold'>
											<span>
												<i className='bi bi-link-45deg'></i> Dependiente En
											</span>
										</div>
										<div>
											<span className='fw-semibold'>Como regularizada:</span>{" "}
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
											<span className='fw-semibold'>Como aprobada:</span>{" "}
											{correlativaFuturaAprobada.length > 0
												? correlativaFuturaAprobada.map((a, idx) => (
														<React.Fragment key={a.acronimo}>
															<span className={handleColor(a)}>{a.nombre}</span>
															{idx < correlativaFuturaAprobada.length - 1 ? ", " : ""}
														</React.Fragment>
												  ))
												: "No es dependiente como aprobada"}
										</div>
									</ListGroupItem>
								</ListGroup>
							</Card.Text>
							<Card.Footer className='bg-dark-custom'>
								<Stack gap={2}>
									<Form.Select
										onChange={(e) => (e.target.value != "-1" ? navigate(`/asignaturas/${e.target.value}`) : "")}
										disabled={asignAprobadas.length == 0 && asignRegularizadas.length == 0}
										defaultValue='-1'
									>
										<option hidden value='-1'>
											{asignAprobadas.length == 0 && asignRegularizadas.length == 0 ? "No hay correlativas" : "Visitar correlativa"}
										</option>
										{[...asignRegularizadas, ...asignAprobadas]
											.toSorted((a, b) => a.nombre.localeCompare(b.nombre))
											.map((asign, index) => (
												<option key={index} value={asign.acronimo}>
													{asign.nombre}
												</option>
											))}
									</Form.Select>
									<Form.Select
										onChange={(e) => (e.target.value != "-1" ? navigate(`/asignaturas/${e.target.value}`) : "")}
										disabled={correlativaFutura.length == 0}
										defaultValue='-1'
									>
										<option hidden value='-1'>
											{correlativaFutura.length == 0 ? "No hay dependientes" : "Visitar Dependiente"}
										</option>
										{correlativaFutura.map((asign, index) => (
											<option key={index} value={asign.acronimo}>
												{asign.nombre}
											</option>
										))}
									</Form.Select>
								</Stack>

								<Button variant='primary' className='me-3 mt-3' onClick={() => navigate(-1)}>
									<i className='bi bi-arrow-left'></i> Volver
								</Button>
							</Card.Footer>
						</Card.Body>
					</Card>
				</Container>
			</Container>
		</>
	);
}
