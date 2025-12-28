import React, { useState } from "react";
import { Form, Modal, Button, FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addAlerta } from "../../utils/firebase/alerts";
import { toast } from "react-toastify";

export default function AlertCreateModal({ show, setShow }) {
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm();

	const handleModal = async (data) => {
		setLoading(true);
		toast
			.promise(addAlerta(data), { pending: "Añadiendo alerta...", success: "Alerta añadida correctamente", error: "Algo salió mal al intentar añadir la alerta" })
			.catch((e) => console.error(e));
		setLoading(false);
		cerrarModal();
	};

	const cerrarModal = () => {
		setShow(false);
	};

	return (
		<Modal show={show} onHide={setShow} centered>
			<Modal.Header>
				<Modal.Title>
					<i className='bi bi-plus-lg'></i> Crear Alerta
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form onSubmit={handleSubmit(handleModal)} id='alertaCreateForm'>
					<Form.Group className='mb-3 text-start'>
						<FloatingLabel
							label={
								<>
									<i className='bi bi-braces'></i> Tipo
								</>
							}
						>
							<Form.Select isInvalid={errors.type} {...register("type", { required: "Un tipo es requerido" })}>
								<option value='info'>Info</option>
								<option value='warning'>Warning</option>
								<option value='danger'>Danger</option>
							</Form.Select>
						</FloatingLabel>
					</Form.Group>

					<Form.Group className='mb-3 text-start'>
						<FloatingLabel
							label={
								<>
									<i className='bi bi-card-heading'></i> Header
								</>
							}
						>
							<Form.Control placeholder='.' required autoFocus isInvalid={errors.header} {...register("header", { required: "Un titulo es requerido" })} />
							{errors.header && <Form.Control.Feedback type='invalid'>{errors.header.message}</Form.Control.Feedback>}
						</FloatingLabel>
					</Form.Group>

					<Form.Group className='mb-3 text-start'>
						<FloatingLabel
							label={
								<>
									<i className='bi bi-card-text'></i> Content
								</>
							}
						>
							<Form.Control placeholder='.' as='textarea' isInvalid={errors.content} {...register("content", { required: "El contenido es requerido" })} />
							{errors.content && <Form.Control.Feedback type='invalid'>{errors.content.message}</Form.Control.Feedback>}
						</FloatingLabel>
					</Form.Group>

					<Form.Group className='mb-3 text-start'>
						<Form.Check type='switch' label='Dismissable' {...register("dismissable")} />
						<Form.Check type='switch' label='Hide?' {...register("hide")} />
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='danger' disabled={loading} onClick={cerrarModal}>
					<i className='bi bi-x-lg'></i> Cancelar
				</Button>
				<Button form='alertaCreateForm' variant='primary' type='submit' disabled={loading || !isDirty}>
					<i className='bi bi-plus-lg'></i> {loading ? "Guardando..." : "Crear Alerta"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
