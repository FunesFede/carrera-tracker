import React, { useEffect, useState } from "react";
import { getAlertas } from "../../utils/firebase/alerts";
import AlertaModal from "./AlertaEditModal";
import AlertCreateModal from "./AlertCreateModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function Alerts() {
	const [alerts, setAlerts] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showCreate, setShowCreate] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState(null);

	useEffect(() => {
		const unsubscribe = getAlertas(
			(data) => {
				setAlerts(data);
			},
			(error) => {
				console.error("Error al obtener alertas:", error);
			}
		);
		return () => unsubscribe();
	}, []);

	const handleEdit = (alert) => {
		setSelectedAlert(alert);
		setShowModal(true);
	};

	return (
		<Card className='bg-card'>
			<CardContent className='pt-6'>
				<AlertaModal show={showModal} setShow={setShowModal} alert={selectedAlert} />
				<AlertCreateModal show={showCreate} setShow={setShowCreate} />
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead>Titulo</TableHead>
							<TableHead>Contenido</TableHead>
							<TableHead>Dismissable</TableHead>
							<TableHead>Hidden</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{alerts.length != 0 ? (
							alerts.map((alert) => {
								return (
									<TableRow key={alert.id} className='cursor-pointer hover:bg-muted/50' onClick={() => handleEdit(alert)}>
										<TableCell>{alert.id}</TableCell>
										<TableCell>{alert.type}</TableCell>
										<TableCell>{alert.header}</TableCell>
										<TableCell>{alert.content}</TableCell>
										<TableCell>{alert?.dismissable ? "Si" : "No"}</TableCell>
										<TableCell>{alert?.hide ? "Si" : "No"}</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={6} className='text-center'>
									No hay alertas
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={6}>
								<span className='text-primary cursor-pointer hover:underline' onClick={() => setShowCreate(true)}>
									<Plus className='inline h-4 w-4 mr-1' /> Añadir Alerta
								</span>
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	);
}
