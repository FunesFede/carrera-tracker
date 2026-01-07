// Styles
import "./App.css";

// React & Router
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getAsignaturas } from "../utils/firebase/asignaturas.js";
import { getNotas } from "../utils/firebase/notas.js";
import { getAlertas } from "../utils/firebase/alerts.js";

// Contexts
import UserStateContext from "../utils/contexts/UserContext.js";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import NotasContext from "../utils/contexts/NotasContext.js";

// Hooks
import { useDarkMode } from "../utils/hooks/useDarkMode";

// UI Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "sonner";
import { AlertTriangle, Info } from "lucide-react";

// Layout Components
import Navbar from "../components/navigation/Navbar.jsx";
import Footer from "../components/navigation/Footer.jsx";
import Spinner from "../components/Spinner.jsx";

// Pages
import Landing from "../pages/Landing.jsx";
import Home from "../pages/Home.jsx";
import AsignaturaInfo from "../pages/AsignaturaInfo.jsx";
import Estadisticas from "../pages/Estadisticas.jsx";
import Profile from "../pages/Profile.jsx";
import Admin from "../pages/admin/Admin.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import PasswordReset from "../pages/auth/PasswordReset.jsx";
import PasswordlessLogin from "../pages/auth/PasswordlessLoginPage.jsx";
import PasswordlessLoginCallback from "../pages/auth/PasswordlessLoginCallback.jsx";
import NotFound from "../pages/NotFound.jsx";

const AlertsList = ({ alerts }) => {
	const filteredAlerts = alerts.filter((a) => !a?.hide);

	if (filteredAlerts.length === 0) return null;

	return (
		<div className='container mx-auto px-4 mt-3'>
			<div className='space-y-2 mb-4'>
				{filteredAlerts.map((alert) => {
					const variant = alert?.type === "danger" ? "destructive" : "default";
					const Icon = alert?.type === "warning" || alert?.type === "danger" ? AlertTriangle : Info;

					return (
						<Alert key={alert.id} variant={variant}>
							<Icon className='h-7 w-7' />
							<AlertTitle className='font-bold text-lg'>{alert?.header || "Información Importante"}</AlertTitle>
							<AlertDescription className='text-md'>{alert.content}</AlertDescription>
						</Alert>
					);
				})}
			</div>
		</div>
	);
};

const RequireAuth = ({ children }) => {
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
		setLoading(!asignaturas && !!user);
	}, [asignaturas, user]);

	if (authChecked && !user) return <Navigate to='/login' replace state={{ from: location }} />;
	if (loading || !authChecked) return <Spinner />;
	return children;
};

function App() {
	const [user, setUser] = useState(null);
	const [asignaturas, setAsignaturas] = useState(null);
	const [notas, setNotas] = useState(null);
	const [alerts, setAlerts] = useState([]);
	const { isDark } = useDarkMode();

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

	useEffect(() => {
		let unsubscribeAsignaturas = null;
		let unsubscribeNotas = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);

			if (unsubscribeAsignaturas) unsubscribeAsignaturas();
			if (unsubscribeNotas) unsubscribeNotas();

			if (currentUser) {
				unsubscribeAsignaturas = getAsignaturas(currentUser.uid, setAsignaturas);
				unsubscribeNotas = getNotas(currentUser.uid, setNotas);
			} else {
				setAsignaturas(null);
				setNotas(null);
			}
		});

		return () => {
			unsubscribeAuth();
			if (unsubscribeAsignaturas) unsubscribeAsignaturas();
			if (unsubscribeNotas) unsubscribeNotas();
		};
	}, []);

	return (
		<>
			<UserStateContext.Provider value={user}>
				<AsignaturasContext.Provider value={asignaturas}>
					<NotasContext.Provider value={notas}>
						<BrowserRouter>
							<div className='flex flex-col min-h-screen'>
								<Navbar setAsignaturas={setAsignaturas} />
								<AlertsList alerts={alerts} />
								<Routes>
									<Route path='/login' element={<Login />} />
									<Route path='/register' element={<Register />} />
									<Route path='/login/passwordreset' element={<PasswordReset />} />
									<Route path='/login/passwordless' element={<PasswordlessLogin />} />
									<Route path='/login/passwordless/callback' element={<PasswordlessLoginCallback />} />

									<Route path='/' element={<Landing />} />

									<Route
										path='/home'
										element={
											<RequireAuth>
												<Home />
											</RequireAuth>
										}
									/>

									<Route
										path='/estadisticas'
										element={
											<RequireAuth>
												<Estadisticas />
											</RequireAuth>
										}
									/>
									<Route
										path='/asignaturas/:acrom'
										element={
											<RequireAuth>
												<AsignaturaInfo />
											</RequireAuth>
										}
									/>

									<Route
										path='/profile/settings'
										element={
											<RequireAuth>
												<Profile />
											</RequireAuth>
										}
									/>

									<Route
										path='/admin'
										element={
											<RequireAuth>
												<Admin />
											</RequireAuth>
										}
									/>

									<Route path='*' element={<NotFound />} />
								</Routes>

								<Toaster position='top-center' theme={isDark ? "dark" : "light"} />
							</div>
							<Footer />
						</BrowserRouter>
					</NotasContext.Provider>
				</AsignaturasContext.Provider>
			</UserStateContext.Provider>
		</>
	);
}

export default App;
