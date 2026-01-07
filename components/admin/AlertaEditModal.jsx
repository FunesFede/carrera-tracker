import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { editAlerta, removeAlerta } from "../../utils/firebase/alerts";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pen, Trash2, Save, Braces, Heading, FileText } from "lucide-react";
import { Spinner } from "../Spinner";
import { toast } from "sonner";
import { ConfirmarAccion } from "../modals/ConfirmarAccion";

export default function AlertaModal({ alert, show, setShow }) {
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		setValue,
		watch,
	} = useForm({ values: alert });

	const cerrarModal = () => {
		setShow(false);
	};

	const handleModal = async (data) => {
		setLoading(true);
		toast
			.promise(editAlerta(alert.id, data), {
				loading: "Editando alerta...",
				success: "Alerta modificada correctamente",
				error: "Algo salió mal al intentar editar la alerta",
			})
			.catch((e) => console.error(e));
		setLoading(false);
		cerrarModal();
	};

	const handleRemove = () => {
		setLoading(true);
		toast
			.promise(removeAlerta(alert.id), {
				loading: "Eliminando alerta...",
				success: "Alerta eliminada correctamente",
				error: "Algo salió mal al intentar eliminar la alerta",
			})
			.catch((e) => console.error(e));
		setLoading(false);
		cerrarModal();
	};

	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<Pen className='inline h-5 w-5 mr-2' /> Editar Alerta
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleModal)} id='alertaEditForm' className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='type'>
							<Braces className='inline h-4 w-4 mr-1' /> Tipo
						</Label>
						<Select onValueChange={(value) => setValue("type", value, { shouldDirty: true })} value={watch("type")}>
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
							<Checkbox id='dismissable' checked={watch("dismissable")} onCheckedChange={(checked) => setValue("dismissable", checked, { shouldDirty: true })} />
							<Label htmlFor='dismissable'>Dismissable</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox id='hide' checked={watch("hide")} onCheckedChange={(checked) => setValue("hide", checked, { shouldDirty: true })} />
							<Label htmlFor='hide'>Hide?</Label>
						</div>
					</div>
				</form>

				<DialogFooter>
					<ConfirmarAccion title='¿Estás seguro de eliminar esta alerta?' description='Esta accion es irreversible' onConfirm={handleRemove}>
						<Button variant='destructive' disabled={loading}>
							<Trash2 className='inline h-4 w-4 mr-2' /> Eliminar
						</Button>
					</ConfirmarAccion>
					<Button form='alertaEditForm' type='submit' disabled={loading || !isDirty}>
						{loading ? (
							<>
								<Spinner className='mr-2' />
								Guardando...
							</>
						) : (
							<>
								<Save className='inline h-4 w-4 mr-2' />
								Guardar Alerta
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
