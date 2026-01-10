import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getAsignaturas } from "../../utils/firebase/asignaturas.js";
import { getNotas } from "../../utils/firebase/notas.js";
import { getAlertas } from "../../utils/firebase/alerts.js";

import UserStateContext from "../../utils/contexts/UserContext.js";
import AsignaturasContext from "../../utils/contexts/AsignaturasContext.js";
import NotasContext from "../../utils/contexts/NotasContext.js";
import AlertsContext from "../../utils/contexts/AlertsContext.js";

import Spinner from "../Spinner.jsx";

/**
 * DataProvider - Componente que encapsula toda la lógica de autenticación y datos
 * Maneja las suscripciones a Firebase y provee los contextos a toda la aplicación
 */
export const DataProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [asignaturas, setAsignaturas] = useState(null);
	const [notas, setNotas] = useState(null);
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);

	// Suscripción a alertas globales (no depende del usuario)
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

	// Suscripción a autenticación y datos del usuario
	useEffect(() => {
		let unsubscribeAsignaturas = null;
		let unsubscribeNotas = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);

			// Limpiar suscripciones anteriores
			if (unsubscribeAsignaturas) unsubscribeAsignaturas();
			if (unsubscribeNotas) unsubscribeNotas();

			if (currentUser) {
				// Usuario logueado: suscribirse a sus datos
				unsubscribeAsignaturas = getAsignaturas(currentUser.uid, setAsignaturas);
				unsubscribeNotas = getNotas(currentUser.uid, setNotas);
			} else {
				// Usuario no logueado: limpiar datos
				setAsignaturas(null);
				setNotas(null);
			}

			// Auth check completado
			setLoading(false);
		});

		return () => {
			unsubscribeAuth();
			if (unsubscribeAsignaturas) unsubscribeAsignaturas();
			if (unsubscribeNotas) unsubscribeNotas();
		};
	}, []);

	// Mostrar spinner mientras se verifica la autenticación
	if (loading) {
		return <Spinner />;
	}

	return (
		<UserStateContext.Provider value={{ user, loading }}>
			<AsignaturasContext.Provider value={{ asignaturas, setAsignaturas }}>
				<NotasContext.Provider value={notas}>
					<AlertsContext.Provider value={alerts}>{children}</AlertsContext.Provider>
				</NotasContext.Provider>
			</AsignaturasContext.Provider>
		</UserStateContext.Provider>
	);
};

export default DataProvider;
