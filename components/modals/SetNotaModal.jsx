import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAsignaturas } from "../../utils/contexts/AsignaturasContext.js";

import { addNotaYAprobar } from "../../utils/firebase/notas";

import { toast } from "sonner";
import { Pencil, Info, X, Save } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SetNotaModalR({ show, setShow, userId, asignatura, aNota }) {
	const [loading, setLoading] = useState(false);

	const { asignaturas: asignaturasContext } = useAsignaturas();

	const form = useForm({
		defaultValues: { nota: aNota || "" },
	});

	const handleModal = async (data) => {
		setLoading(true);

		toast.promise(addNotaYAprobar(userId, asignatura, data, aNota, asignaturasContext), {
			loading: aNota ? "Modificando nota..." : "Registrando nota...",
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
		<Dialog open={show} onOpenChange={setShow}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Pencil className='h-5 w-5' />
						Nota exámen final: {asignatura.nombre}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					{!aNota && (
						<p className='text-sm text-start flex items-start gap-2'>
							<Info className='h-4 w-4 mt-0.5 flex-shrink-0' />
							<span>Antes de marcar como aprobada la asignatura, debés proveer la nota del exámen final. Esto es para calcular tu promedio.</span>
						</p>
					)}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleModal)} id={"NotaForm" + asignatura.acronimo} className='space-y-4'>
							<FormField
								control={form.control}
								name='nota'
								rules={{
									required: "Una nota es requerida",
									min: { value: 6, message: "La nota debe ser al menos 6" },
									max: { value: 10, message: "La nota debe ser como máximo 10" },
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={"notaInput" + asignatura.acronimo}>Nota</FormLabel>
										<FormControl>
											<Input {...field} id={"notaInput" + asignatura.acronimo} type='number' min={6} max={10} autoFocus />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>

				<DialogFooter className='gap-2'>
					<Button variant='destructive' disabled={loading} onClick={cerrarModal}>
						<X className='mr-2 h-4 w-4' />
						Cancelar
					</Button>
					<Button form={"NotaForm" + asignatura.acronimo} type='submit' disabled={loading || !form.formState.isDirty}>
						<Save className='mr-2 h-4 w-4' />
						{loading ? "Guardando..." : "Guardar Nota"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
