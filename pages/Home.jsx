import { useContext, useMemo, useState } from "react";
import UserStateContext from "../utils/contexts/UserContext.js";

import asignaturasData from "../data/asignaturas.json";

import Asignatura from "../components/Asignatura.jsx";

import CorrelativasModal from "../components/modals/CorrelativasModal.jsx";
import SetNotaModal from "../components/modals/SetNotaModal.jsx";
import MobileIndex from "../components/MobileIndex.jsx";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Badge, Col, Container, Row } from "react-bootstrap";

export default function Main() {
	const user = useContext(UserStateContext);
	const asignaturasContext = useContext(AsignaturasContext);

	const asignaturasAnio = useMemo(() => {
		const filtrar = (n) => asignaturasData.filter((a) => a.anio === n).sort((a, b) => a.nombre.localeCompare(b.nombre));

		return {
			primero: filtrar(1),
			segundo: filtrar(2),
			tercero: filtrar(3),
			cuarto: filtrar(4),
			quinto: filtrar(5),
		};
	}, [asignaturasData]);

	const handleSaludo = () => {
		const now = new Date();
		const hora = now.getHours();

		if (hora >= 6 && hora < 12) return "🌤 Buenos días";
		if (hora >= 12 && hora < 20) return "🌄 Buenas tardes";
		if (hora >= 20 || hora < 6) return "🌙 Buenas noches";
		else return "👋 Hola";
	};

	const getAprobadasCount = (asigs) => {
		return asigs.filter((a) => asignaturasContext.aprobadas.includes(a.acronimo)).length;
	};

	const getRegularizadasCount = (asigs) => {
		return asigs.filter((a) => asignaturasContext.regularizadas.includes(a.acronimo)).length;
	};

	const getACursarCount = (asigs) => {
		return asigs.filter((a) => !asignaturasContext.aprobadas.includes(a.acronimo) && !asignaturasContext.regularizadas.includes(a.acronimo)).length;
	};

	const getTotalCount = (asigs) => {
		return asigs.filter((a) => asignaturasContext.aprobadas.includes(a.acronimo) && asignaturasContext.regularizadas.includes(a.acronimo)).length;
	};

	const getTooltip = (asigs) => {
		return (
			<Tooltip>
				{asigs.length !== getAprobadasCount(asigs) ? (
					<>
						<p className='m-0 text-start fw-semibold'>
							Aprobadas: <span className='fw-normal'>{getAprobadasCount(asigs)}</span>
						</p>
						<p className='m-0 text-start fw-semibold'>
							Regularizadas: <span className='fw-normal'>{getRegularizadasCount(asigs)}</span>
						</p>
						<p className='m-0 text-start fw-semibold'>
							A cursar: <span className='fw-normal'>{getACursarCount(asigs)}</span>
						</p>
					</>
				) : (
					<p className='m-0'>Felicidades, pasaste este año :)</p>
				)}
			</Tooltip>
		);
	};

	const getInfoIcon = (asigs) => {
		return (
			<OverlayTrigger placement='right' overlay={getTooltip(asigs)}>
				<i class='bi bi-question-circle-fill'></i>
			</OverlayTrigger>
		);
	};

	return (
		<>
			<Container fluid className='py-4 bg-dark text-white d-flex flex-column flex-grow-1'>
				<Container fluid>
					<h3 className='text-start mb-3 mx-2'>
						{handleSaludo()}, {user?.displayName ? user.displayName + "." : "como estás hoy?"}
					</h3>

					<MobileIndex />

					<Row className='gap-4 mx-2 justify-content-center'>
						<Col xs={12} md className='bg-dark-custom rounded py-3 px-1' id='primero'>
							<h3 className='titulo-columna'>Primer Año</h3>

							{asignaturasAnio.primero.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</Col>

						<Col xs={12} md className='bg-dark-custom rounded py-3 px-1' id='segundo'>
							<h3 className='titulo-columna'>Segundo Año</h3>

							{asignaturasAnio.segundo.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</Col>

						<Col xs={12} md className='bg-dark-custom rounded py-3 px-1' id='tercero'>
							<h3 className='titulo-columna'>Tercer Año</h3>

							{asignaturasAnio.tercero.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</Col>

						<Col xs={12} md className='bg-dark-custom rounded py-3 px-1' id='cuarto'>
							<h3 className='titulo-columna'>Cuarto Año</h3>

							{asignaturasAnio.cuarto.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</Col>

						<Col xs={12} md className='bg-dark-custom rounded py-3 px-1' id='quinto'>
							<h3 className='titulo-columna'>Quinto Año</h3>

							{asignaturasAnio.quinto.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</Col>
					</Row>
				</Container>
			</Container>
		</>
	);
}
