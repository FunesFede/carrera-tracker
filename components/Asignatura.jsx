import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Modal } from "bootstrap";

import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import UserStateContext from "../utils/contexts/UserContext.js";
import SetNotaModal from "./modals/SetNotaModal.jsx";

import { esCursable, esHecha } from "../utils/asignaturasHelpers.js";

import { addRegularizada, borraraAsignaturaYDependencias } from "../utils/firebase/asignaturas.js";
import { Badge, Button, Card, Container } from "react-bootstrap";

export default function Asignatura({ asignatura }) {
	const navigate = useNavigate();
	const asignaturas = useContext(AsignaturasContext);
	const user = useContext(UserStateContext);
	const [showModal, setShowModal] = useState(false);

	const hecha = asignaturas ? esHecha(asignaturas, asignatura) : false;
	const cursable = asignaturas ? esCursable(asignaturas, asignatura) : false;
	const aprobada = asignaturas ? asignaturas.aprobadas.includes(asignatura.acronimo) : false;

	const handleIcono = () => {
		if (cursable) {
			if (hecha) {
				if (asignaturas.aprobadas.includes(asignatura.acronimo)) return <i className='bi bi-check-lg'></i>;
				else return <i className='bi bi-hourglass-split'></i>;
			} else return <i className='bi bi-unlock-fill'></i>;
		} else return <i className='bi bi-lock-fill'></i>;
	};

	const openModal = () => {
		setShowModal(true);
	};

	const eliminarAsignatura = () => {
		if (window.confirm("¿Seguro que deseas eliminar esta asignatura?\n\nAsignaturas que dependan de esta serán eliminadas y la nota de exámen final será removida.")) {
			borraraAsignaturaYDependencias(user.uid, asignatura.acronimo);
		}
	};

	return (
		<>
			<Container fluid className='mb-3 user-select-none'>
				<SetNotaModal show={showModal} setShow={setShowModal} userId={user.uid} asignatura={asignatura} key={asignatura.acronimo + "NotaModal"} />
				<Card
					bg={hecha ? (asignaturas.aprobadas.includes(asignatura.acronimo) ? "success" : "warning") : cursable ? "secondary" : "danger"}
					className={"bg-gradient text-white bg-opacity-" + (hecha ? (asignaturas.aprobadas.includes(asignatura.acronimo) ? "50" : "50") : cursable ? "75" : "75")}
				>
					<Card.Body>
						<Card.Title>
							{handleIcono()}
							<span className={aprobada ? "text-decoration-line-through" : ""}>{asignatura.nombre}</span>{" "}
							{asignatura.tipo == "Electiva" && (
								<Badge bg='success' className='bg-gradient bg-opacity-75'>
									Electiva
								</Badge>
							)}
						</Card.Title>

						<Container className='botones-container'>
							<Button
								variant='success'
								size='sm'
								title='Aprobar Asignatura'
								disabled={!cursable || asignaturas.aprobadas.includes(asignatura.acronimo)}
								className='shadow me-2 text-white'
								id={asignatura.acronimo + "btnNotaModal"}
								onClick={openModal}
							>
								<i className='bi bi-check-lg'></i>
							</Button>

							<Button
								variant='warning'
								size='sm'
								title='Regularizar Asignatura'
								disabled={!cursable || hecha}
								className='me-2 shadow text-white'
								onClick={() => addRegularizada(user.uid, asignatura.acronimo)}
							>
								<i className='bi bi-hourglass-split'></i>
							</Button>

							<Button variant='primary' size='sm' title='Ver Información' className='me-2 shadow' onClick={() => navigate(`/asignaturas/${asignatura.acronimo}`)}>
								<i className='bi bi-info-lg'></i>
							</Button>

							{/* <button title='Ver Correlativas' className='btn btn-primary btn-sm me-2' data-bs-toggle='modal' data-bs-target={"#" + asignatura.acronimo + "modal"}>
								<i className='bi bi-arrow-left-right'></i>
							</button> */}

							<Button variant='danger' size='sm' title='Eliminar Asignatura' disabled={!hecha} className='shadow' onClick={eliminarAsignatura}>
								<i className='bi bi-trash3'></i>
							</Button>
						</Container>
					</Card.Body>
				</Card>
			</Container>
		</>
	);
}
