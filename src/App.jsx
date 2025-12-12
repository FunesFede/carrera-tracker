import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router";
import { ToastContainer, Flip } from "react-toastify";
import { useState, useEffect } from "react";

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
import { Alert, Container } from "react-bootstrap";
import Admin from "../pages/admin/Admin.jsx";

function App() {
	const [user, setUser] = useState(null);
	const [asignaturas, setAsignaturas] = useState(null);
	const [notas, setNotas] = useState(null);
	const [loading, setLoading] = useState(true);
	const [authChecked, setAuthChecked] = useState(false);
	const [alerts, setAlerts] = useState([]);

	const handleSignInSuccess = (user) => {
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
							<div className='d-flex flex-column min-vh-100'>
								<Navbar setAsignaturas={setAsignaturas} />
								<Container fluid className='m-0 mt-3'>
									{alerts.length != 0 ? (
										alerts.map((alert) => {
											if (alert?.hide) {
												return;
											}
											return (
												<Alert dismissible={alert?.dismissable || false} key={alert.id} variant={alert?.type || "info"} className='text-start m-0'>
													<Alert.Heading>
														{alert?.type == "warning" || alert?.type == "danger" ? (
															<i className='bi bi-exclamation-triangle'></i>
														) : (
															<i className='bi bi-info-circle'></i>
														)}{" "}
														{alert?.header || "Información Importante"}
													</Alert.Heading>
													<p className='mb-0'>{alert.content}</p>
												</Alert>
											);
										})
									) : (
										<></>
									)}
								</Container>
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

								<ToastContainer
									position='top-center'
									autoClose={5500}
									hideProgressBar={false}
									newestOnTop={false}
									closeOnClick={false}
									rtl={false}
									pauseOnFocusLoss
									draggable
									pauseOnHover
									theme='dark'
									transition={Flip}
								/>
							</div>
							<Footer />
						</BrowserRouter>
					</NotasContext.Provider>
				</AsignaturasContext.Provider>
			</UserStateContext.Provider>

			<div className='offcanvas offcanvas-start' tabIndex='-1' id='GuiaBotones' aria-labelledby='GuiaBotones'>
				<div className='offcanvas-header'>
					<h5 className='offcanvas-title' id='offcanvasGuiaBotonesLabel'>
						Guía Botones e Iconos
					</h5>
					<button type='button' className='btn-close' data-bs-dismiss='offcanvas' aria-label='Close'></button>
				</div>
				<div className='offcanvas-body'>
					<InfoBanner />
				</div>
			</div>
		</>
	);
}

export default App;
