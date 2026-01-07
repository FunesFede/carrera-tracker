import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";

import Home from "../pages/Home.jsx";
import AsignaturaInfo from "../pages/AsignaturaInfo.jsx";
import Footer from "../components/navigation/Footer.jsx";
import Estadisticas from "../pages/Estadisticas.jsx";
import Navbar from "../components/navigation/Navbar.jsx";
import InfoBanner from "../components/InfoBanner.jsx";
import Login from "../pages/auth/Login.jsx";
import NotFound from "../pages/NotFound.jsx";
import Register from "../pages/auth/Register.jsx";
import PasswordReset from "../pages/auth/PasswordReset.jsx";
import Spinner from "../components/Spinner.jsx";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

import { getAsignaturas } from "../utils/firebase/asignaturas.js";

import UserStateContext from "../utils/contexts/UserContext.js";
import AsignaturasContext from "../utils/contexts/AsignaturasContext.js";
import NotasContext from "../utils/contexts/NotasContext.js";
import Profile from "../pages/Profile.jsx";
import { getNotas } from "../utils/firebase/notas.js";
import PasswordlessLogin from "../pages/auth/PasswordlessLoginPage.jsx";
import PasswordlessLoginCallback from "../pages/auth/PasswordlessLoginCallback.jsx";
import { getAlertas } from "../utils/firebase/alerts.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Admin from "../pages/admin/Admin.jsx";
import { Toaster } from "sonner";
import { useDarkMode } from "../utils/hooks/useDarkMode";

function App() {
	const [user, setUser] = useState(null);
	const [asignaturas, setAsignaturas] = useState(null);
	const [notas, setNotas] = useState(null);
	const [loading, setLoading] = useState(true);
	const [authChecked, setAuthChecked] = useState(false);
	const [alerts, setAlerts] = useState([]);
	const isDark = useDarkMode();

	const handleSignInSuccess = () => {
		setLoading(true);
	};

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
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				getAsignaturas(currentUser.uid, setAsignaturas);
				getNotas(currentUser.uid, setNotas);
			}
			setAuthChecked(true);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (asignaturas) setLoading(false);
		else setLoading(true);
	}, [asignaturas]);

	const RequireAuth = ({ children }) => {
		const location = useLocation();
		if (authChecked && !user) return <Navigate to='/login' replace state={{ from: location }} />;
		if (loading || !authChecked) return <Spinner />;
		return children;
	};

	return (
		<>
			<UserStateContext.Provider value={user}>
				<AsignaturasContext.Provider value={asignaturas}>
					<NotasContext.Provider value={notas}>
						<BrowserRouter>
							<div className='flex flex-col min-h-screen'>
								<Navbar setAsignaturas={setAsignaturas} />
								<main className='container mx-auto px-4 mt-3'>
									{alerts.length !== 0 && (
										<div className='space-y-2 mb-4'>
											{alerts
												.filter((a) => !a?.hide)
												.map((alert) => {
													console.log(alert);
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
									)}
								</main>
								<Routes>
									<Route path='/login' element={<Login signInSuccessFunc={handleSignInSuccess} />} />
									<Route path='/register' element={<Register signInSuccessFunc={handleSignInSuccess} />} />
									<Route path='/login/passwordreset' element={<PasswordReset />} />
									<Route path='/login/passwordless' element={<PasswordlessLogin />} />
									<Route path='/login/passwordless/callback' element={<PasswordlessLoginCallback />} />

									<Route
										path='/'
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

			<Sheet>
				<SheetTrigger className='hidden'>Open</SheetTrigger>
				<SheetContent side='left'>
					<SheetHeader>
						<SheetTitle>Guía Botones e Iconos</SheetTitle>
					</SheetHeader>
					<div className='mt-4'>
						<InfoBanner />
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}

export default App;
