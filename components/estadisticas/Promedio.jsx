import React, { useContext, useState } from "react";

import AsignaturasContext from "../../utils/contexts/AsignaturasContext";
import NotasContext from "../../utils/contexts/NotasContext";
import asignaturasData from "../../data/asignaturas.json";
import { NavLink } from "react-router";
import { Alert, Button, Card, Col, Collapse, Container, Form, Row, Table } from "react-bootstrap";

export default function Promedio() {
	const asignaturas = useContext(AsignaturasContext);
	const notas = useContext(NotasContext);
	const [aplazos, setAplazos] = useState(0);
	const [openCollapse, setOpenCollapse] = useState(false);

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
		<Container fluid>
			<Row className='row g-3 p-2 mb-4 user-select-none'>
				<Col md={4} className='show-mobile'>
					<Card className='bg-success bg-gradient text-white h-100'>
						<Card.Body className='text-center'>
							<i className='bi bi-check-circle fs-1'></i>
							<h3 className='mt-2 mb-0'>{cantidadNotas}</h3>
							<p className='mb-0'>Asignaturas aprobadas</p>
						</Card.Body>
					</Card>
				</Col>

				<Col md={4}>
					<Card className='bg-primary bg-gradient text-white h-100'>
						<Card.Body className='text-center'>
							<i className='bi bi-file-earmark-check-fill fs-1'></i>
							<h3 className='mt-2 mb-0'>{promedio}</h3>
							<p className='mb-0'>Promedio sin aplazos</p>
						</Card.Body>
					</Card>
				</Col>

				<Col md={2}>
					<Card className='bg-danger bg-gradient text-white h-100'>
						<Card.Body className='text-center'>
							<i className='bi bi-file-earmark-excel-fill fs-1'></i>
							<h3 className='mt-2 mb-0'>{aplazos != 0 ? promAplazos : "A Calcular"}</h3>
							<p className='mb-0'>Promedio con aplazos</p>
						</Card.Body>
					</Card>
				</Col>

				<Col md={2}>
					<Card className='bg-secondary bg-gradient text-white h-100'>
						<Card.Body className='text-center'>
							<i className='bi bi-folder-x fs-1'></i>
							<Form.Control
								id='inputAplazos'
								defaultValue={0}
								onChange={(e) => setAplazos(Number(e.target.value))}
								className='form-control text-center mt-2 mb-0'
								type='number'
								min={0}
							/>
							<p className='mb-0'>Cantidad Aplazos</p>
						</Card.Body>
					</Card>
				</Col>

				<Col md={4} className='hide-mobile'>
					<Card className='bg-success bg-gradient text-white h-100'>
						<Card.Body className='text-center'>
							<i className='bi bi-check-circle fs-1'></i>
							<h3 className='mt-2 mb-0'>{cantidadNotas}</h3>
							<p className='mb-0'>Asignaturas aprobadas</p>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{asignaturas?.aprobadas.length != Object.values(notas).length && (
				<Alert variant='danger' className='mt-3'>
					<i className='bi bi-exclamation-triangle-fill'></i> La cantidad de notas no es igual a la cantidad de aprobadas registradas.
					<span className='fw-bold'> Esto afecta el cálculo de tu promedio</span>.
				</Alert>
			)}

			<Container fluid className='container-rounded-dark p-3 m-1'>
				<div className='d-flex justify-content-between align-items-center clickable' aria-expanded={openCollapse} onClick={() => setOpenCollapse(!openCollapse)}>
					<h5 className='text-white mb-0'>
						<i className='bi bi-list-check'></i> Detalle de Notas
					</h5>
					<Button variant='link' className='text-white text-decoration-none'>
						<i className={openCollapse ? "bi bi-chevron-down" : "bi bi-chevron-left"}></i>
					</Button>
				</div>

				<Collapse in={openCollapse} className='mt-2'>
					<div>
						<Table responsive striped>
							<thead>
								<tr>
									<th>Año</th>
									<th scope='col'>
										<i className='bi bi-sort-alpha-down'></i> Asignatura
									</th>
									<th scope='col'>Nota Final</th>
									<th scope='col'></th>
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{faltantes.length > 0 &&
									faltantes.map((faltante, index) => {
										const nombre = asignaturasData.find((a) => a.acronimo === faltante)?.nombre;
										return (
											<tr key={index} className='table-danger'>
												<td>{nombre} </td>
												<td>
													<span className='badge bg-danger'>
														<i className='bi bi-exclamation-triangle-fill'></i>
													</span>
												</td>
												<td>
													<NavLink to={`/asignaturas/${faltante}?edit=true`}>
														<i className='bi bi-pen'></i>
													</NavLink>
												</td>
											</tr>
										);
									})}

								{notasDetalle.map((asig, index) => {
									return (
										<tr key={index}>
											<td>{asig.anio}</td>
											<td>{asig.nombre} </td>
											<td>
												<span className={`badge ${asig.nota >= 8 ? "bg-success" : asig.nota >= 6 ? "bg-warning" : "bg-danger"}`}>{asig.nota}</span>
											</td>
											<td>
												<NavLink to={`/asignaturas/${asig.acrom}?edit=true`}>
													<i className='bi bi-pen'></i>
												</NavLink>
											</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot>
								<tr className='fw-semibold'>
									<td></td>
									<td>Cantidad: {cantidadNotas}</td>
									<td>Suma: {sumaNotas}</td>
									<td></td>
								</tr>
							</tfoot>
						</Table>
					</div>
				</Collapse>
			</Container>
		</Container>
	);
}
