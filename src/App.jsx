// Styles
import "./App.css";

// React & Router
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";

// Hooks
import { useDarkMode } from "../utils/hooks/useDarkMode";

// UI Components
import { Toaster } from "sonner";

// Layout Components
import Navbar from "../components/navigation/Navbar.jsx";
import Footer from "../components/navigation/Footer.jsx";
import AlertsList from "../components/AlertsList.jsx";

// Provider
import DataProvider from "../components/providers/DataProvider.jsx";

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

import RequireAuth from "../components/RequireAuth.jsx";

function App() {
	const { isDark } = useDarkMode();

	return (
		<DataProvider>
			<BrowserRouter>
				<div className='min-h-screen flex flex-col'>
					<Navbar />
					<AlertsList />
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
		</DataProvider>
	);
}

export default App;
