import React from "react";
import { Navigate, useLocation } from "react-router";
import { useUser } from "../utils/contexts/UserContext.js";
import { useAsignaturas } from "../utils/contexts/AsignaturasContext.js";
import Spinner from "./Spinner.jsx";

export default function RequireAuth({ children }) {
	const location = useLocation();
	const { user, loading: authLoading } = useUser();
	const { asignaturas } = useAsignaturas();

	// Mostrar spinner mientras se verifica auth o se cargan datos
	if (authLoading) return <Spinner />;

	// Usuario no autenticado: redirigir a login
	if (!user) return <Navigate to='/login' replace state={{ from: location }} />;

	// Usuario autenticado pero datos aún cargando
	if (!asignaturas) return <Spinner />;

	return children;
}
