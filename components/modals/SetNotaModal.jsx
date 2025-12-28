import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AsignaturasContext from "../../utils/contexts/AsignaturasContext.js";

import { addNotaYAprobar } from "../../utils/firebase/notas";

import { Slide, toast } from "react-toastify";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function SetNotaModalR({ show, setShow, userId, asignatura, aNota }) {
	const [loading, setLoading] = useState(false);

	const asignaturasContext = useContext(AsignaturasContext);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({ values: { nota: aNota } });

	const handleModal = async (data) => {
		setLoading(true);

		toast.promise(addNotaYAprobar(userId, asignatura, data, aNota, asignaturasContext), {
			pending: aNota ? "Modificando nota..." : "Registrando nota...",
			success: aNota ? "Nota modificada correctamente" : "Nota registrada correctamente",
			error: aNota ? "Algo salió mal al intentar modificar la nota" : "Algo salió mal al intentar registrar la nota",
		});

		setLoading(false);
		cerrarModal();
	};

	const cerrarModal = () => {
		setShow(false);
	};

	return (
		<Modal show={show} onHide={setShow} centered id={asignatura.acronimo + "NotaModal"} key={asignatura.acronimo + "NotaModal"}>
			<Modal.Header>
				<Modal.Title>
					<i className='bi bi-pen'></i> Nota exámen final: {asignatura.nombre}
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{aNota ? (
					""
				) : (
					<p className='text-start'>
						<i className='bi bi-info-circle'></i> Antes de marcar como aprobada la asignatura, debés proveer la nota del exámen final. Esto es para calcular tu
						promedio.
					</p>
				)}
				<Form onSubmit={handleSubmit(handleModal)} id={"NotaForm" + asignatura.acronimo}>
					<Form.Group className='mb-3 text-start'>
						<Form.Label htmlFor={"notaInput" + asignatura.acronimo}>
							<i className='bi bi-123'></i> Nota
						</Form.Label>
						<Form.Control
							autoFocus
							id={"notaInput" + asignatura.acronimo}
							isInvalid={errors.nota}
							type='number'
							min={6}
							max={10}
							{...register("nota", { required: "Una nota es requerida", min: 6, max: 10 })}
						/>
						{errors.nota && <Form.Control.Feedback type='invalid'>{errors.nota.message || "La nota debe estar entre 6 y 10"}</Form.Control.Feedback>}
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='danger' disabled={loading} onClick={cerrarModal}>
					<i className='bi bi-x-lg'></i> Cancelar
				</Button>
				<Button form={"NotaForm" + asignatura.acronimo} variant='primary' type='submit' disabled={loading || !isDirty}>
					<i className='bi bi-save-fill'></i> {loading ? "Guardando..." : "Guardar Nota"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
