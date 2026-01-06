import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { addAlerta } from "../../utils/firebase/alerts";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Braces, Heading, FileText } from "lucide-react";
import { Spinner } from "../Spinner";

export default function AlertCreateModal({ show, setShow }) {
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		setValue,
		watch,
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
		<Dialog open={show} onOpenChange={setShow}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<Plus className='inline h-5 w-5 mr-2' /> Crear Alerta
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleModal)} id='alertaCreateForm' className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='type'>
							<Braces className='inline h-4 w-4 mr-1' /> Tipo
						</Label>
						<Select onValueChange={(value) => setValue("type", value)} defaultValue='info'>
							<SelectTrigger className={errors.type ? "border-destructive" : ""}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='info'>Info</SelectItem>
								<SelectItem value='warning'>Warning</SelectItem>
								<SelectItem value='danger'>Danger</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='header'>
							<Heading className='inline h-4 w-4 mr-1' /> Header
						</Label>
						<Input id='header' autoFocus className={errors.header ? "border-destructive" : ""} {...register("header", { required: "Un titulo es requerido" })} />
						{errors.header && <p className='text-sm text-destructive'>{errors.header.message}</p>}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='content'>
							<FileText className='inline h-4 w-4 mr-1' /> Content
						</Label>
						<textarea
							id='content'
							className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.content ? "border-destructive" : "border-input"}`}
							{...register("content", { required: "El contenido es requerido" })}
						/>
						{errors.content && <p className='text-sm text-destructive'>{errors.content.message}</p>}
					</div>

					<div className='space-y-2'>
						<div className='flex items-center space-x-2'>
							<Checkbox id='dismissable' {...register("dismissable")} />
							<Label htmlFor='dismissable'>Dismissable</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox id='hide' {...register("hide")} />
							<Label htmlFor='hide'>Hide?</Label>
						</div>
					</div>
				</form>

				<DialogFooter>
					<Button variant='destructive' disabled={loading} onClick={cerrarModal}>
						<X className='inline h-4 w-4 mr-2' /> Cancelar
					</Button>
					<Button form='alertaCreateForm' type='submit' disabled={loading || !isDirty}>
						{loading ? (
							<>
								<Spinner className='mr-2' />
								Guardando...
							</>
						) : (
							<>
								<Plus className='inline h-4 w-4 mr-2' />
								Crear Alerta
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
