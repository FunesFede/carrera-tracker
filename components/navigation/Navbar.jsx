import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";

import asignaturas from "../../data/asignaturas.json";
import UserStateContext from "../../utils/contexts/UserContext";
import Profile from "../Profile";
import { Button, Container, Form, InputGroup, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function NavbarR({ setAsignaturas }) {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const user = useContext(UserStateContext);

	const buscarAsignatura = (e) => {
		e.preventDefault();

		if ((query == "" || query == " " || !query) && window.location.pathname.includes("asignaturas")) navigate("/");

		if (!query.trim()) return;
		const lowerQuery = query.toLowerCase();
		const closest =
			asignaturas.find((a) => a.nombre.toLowerCase() === lowerQuery || a.acronimo.toLowerCase() === lowerQuery) ||
			asignaturas.find((a) => a.nombre.toLowerCase().includes(lowerQuery) || a.acronimo.toLowerCase().includes(lowerQuery));
		if (closest) {
			navigate(`/asignaturas/${closest.acronimo}`);
		} else {
			toast.error("No hay resultados para la asignatura buscada, ¿estás escribiendo el acrónimo o nombre correctamente?");
		}
	};

	return (
		<Navbar sticky='top' expand='lg' className='bg-body-tertiary px-3 py-1'>
			<NavLink to='/' className='navbar-brand'>
				<img src='/images/logo.png' alt='Logo' width='100' height='30' className='d-inline-block align-text-top' />
			</NavLink>
			<Navbar.Toggle aria-controls='navbarSupportedContent' />
			<Navbar.Collapse id='navbarSupportedContent'>
				<Nav className='me-auto mb-2 mb-lg-0'>
					<Nav.Item>
						<NavLink className={"nav-link " + (user ? "" : "disabled")} to='/'>
							<i className='bi bi-house-fill'></i> Home
						</NavLink>
					</Nav.Item>
					<Nav.Item>
						<NavLink className={"nav-link " + (user ? "" : "disabled")} to='/estadisticas'>
							<i className='bi bi-clipboard-data-fill'></i> Estadísticas
						</NavLink>
					</Nav.Item>
					<NavDropdown
						title={
							<>
								<i className='bi bi-building-fill'></i> Universidad
							</>
						}
						className='dropdown-perfil'
					>
						<NavDropdown.Item href='https://a4.frc.utn.edu.ar' target='_blank' rel='noopener noreferrer'>
							<i className='bi bi-kanban-fill'></i> Autogestión
						</NavDropdown.Item>

						<NavDropdown.Item href='https://uv.frc.utn.edu.ar' target='_blank' rel='noopener noreferrer'>
							<i className='bi bi-easel3-fill'></i> Aula Virtual
						</NavDropdown.Item>

						<NavDropdown
							title={
								<>
									<i className='bi bi-calendar-week'></i> Horarios
								</>
							}
							drop='end'
							className='dropend hide-mobile'
						>
							<NavDropdown.Item href='/docs/horarios/primero.pdf' target='_blank'>
								<i className='bi bi-calendar-week'></i> Primer Año
							</NavDropdown.Item>
							<NavDropdown.Item href='/docs/horarios/segundo.pdf' target='_blank'>
								<i className='bi bi-calendar-week'></i> Segundo Año
							</NavDropdown.Item>
							<NavDropdown.Item href='/docs/horarios/tercero.pdf' target='_blank'>
								<i className='bi bi-calendar-week'></i> Tercer Año
							</NavDropdown.Item>
							<NavDropdown.Item href='/docs/horarios/cuarto.pdf' target='_blank'>
								<i className='bi bi-calendar-week'></i> Cuarto Año
							</NavDropdown.Item>
							<NavDropdown.Item href='/docs/horarios/quinto.pdf' target='_blank'>
								<i className='bi bi-calendar-week'></i> Quinto Año
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href='/docs/horarios/seminario.pdf' target='_blank'>
								<i className='bi bi-calendar-week'></i> Seminario
							</NavDropdown.Item>
						</NavDropdown>

						<NavDropdown.Item href='https://www.institucional.frc.utn.edu.ar/sistemas/' target='_blank' rel='noopener noreferrer'>
							<i className='bi bi-cpu'></i> Departamento de Sistemas
						</NavDropdown.Item>
						<NavDropdown.Item href='https://seu.frc.utn.edu.ar/?pIs=1286' target='_blank' rel='noopener noreferrer'>
							<i className='bi bi-laptop'></i> Pasantías
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href='/docs/correlativas.pdf' target='_blank' rel='noopener noreferrer'>
							<i className='bi bi-file-earmark-text-fill'></i> Correlativas PDF
						</NavDropdown.Item>
					</NavDropdown>

					<NavDropdown
						title={
							<>
								<i className='bi bi-calendar-week'></i> Horarios
							</>
						}
						className='show-mobile'
					>
						<NavDropdown.Item href='/docs/horarios/primero.pdf' target='_blank'>
							<i className='bi bi-calendar-week'></i> Primer Año
						</NavDropdown.Item>
						<NavDropdown.Item href='/docs/horarios/segundo.pdf' target='_blank'>
							<i className='bi bi-calendar-week'></i> Segundo Año
						</NavDropdown.Item>
						<NavDropdown.Item href='/docs/horarios/tercero.pdf' target='_blank'>
							<i className='bi bi-calendar-week'></i> Tercer Año
						</NavDropdown.Item>
						<NavDropdown.Item href='/docs/horarios/cuarto.pdf' target='_blank'>
							<i className='bi bi-calendar-week'></i> Cuarto Año
						</NavDropdown.Item>
						<NavDropdown.Item href='/docs/horarios/quinto.pdf' target='_blank'>
							<i className='bi bi-calendar-week'></i> Quinto Año
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href='/docs/horarios/seminario.pdf' target='_blank'>
							<i className='bi bi-calendar-week'></i> Seminario
						</NavDropdown.Item>
					</NavDropdown>
					{/* <li className='nav-item'>
							<a className='nav-link' data-bs-toggle='offcanvas' href='#GuiaBotones' role='button' aria-controls='GuiaBotones'>
								<i className='bi bi-question-circle-fill'></i> Guía Botones
							</a>
						</li> */}
					{(user?.uid == "qXjO3KvuJRca9ED7kwPJFvW0qbo1" || user?.uid == "MBW4S4gg2JfueKmOnpLPHFADR4k1") && (
						<li className='nav-item'>
							<NavLink to='/admin' className='nav-link'>
								<i className='bi bi-tools'></i> Admin
							</NavLink>
						</li>
					)}
				</Nav>
				<Form role='search' onSubmit={buscarAsignatura}>
					<InputGroup>
						<Form.Control type='search' placeholder='Buscar Asignatura...' aria-label='Buscar Asignatura' onChange={(e) => setQuery(e.target.value)} disabled={!user} />
						<Button variant='outline-primary' type='submit' disabled={!user}>
							<i className='bi bi-search'></i>
						</Button>
					</InputGroup>
				</Form>
				<Navbar.Text>
					<Profile setAsignaturas={setAsignaturas} />
				</Navbar.Text>
			</Navbar.Collapse>
		</Navbar>
	);
}
