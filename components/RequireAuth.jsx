import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config.js";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import UserStateContext from "../utils/contexts/UserContext.js";
import Spinner from "./Spinner.jsx";

export default function RequireAuth({ children }) {
	const location = useLocation();
	const [authChecked, setAuthChecked] = useState(false);
	const [loading, setLoading] = useState(true);
	const user = useContext(UserStateContext);
	const asignaturas = useContext(AsignaturasContext);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, () => {
			setAuthChecked(true);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		setLoading(!asignaturas || !user);
	}, [asignaturas, user]);

	if (authChecked && !user) return <Navigate to='/login' replace state={{ from: location }} />;
	if (loading || !authChecked) return <Spinner />;
	return children;
}
