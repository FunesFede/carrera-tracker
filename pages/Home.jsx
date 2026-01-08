import asignaturasData from "../data/asignaturas.json";

import Asignatura from "../components/Asignatura.jsx";
import { useMemo } from "react";

export default function Main() {
	const asignaturasAnio = useMemo(() => {
		const filtrar = (n) => asignaturasData.filter((a) => a.anio === n).sort((a, b) => a.nombre.localeCompare(b.nombre));

		return {
			primero: filtrar(1),
			segundo: filtrar(2),
			tercero: filtrar(3),
			cuarto: filtrar(4),
			quinto: filtrar(5),
		};
	}, []);

	return (
		<>
			<div className='my-4 bg-background flex flex-1 flex-grow '>
				<div className='container mx-auto px-4'>
					<h3 className='text-start mb-6 text-2xl font-semibold'></h3>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
						<div className='bg-card rounded-lg p-4 border' id='primero'>
							<h3 className='text-xl font-semibold mb-4'>Primer Año</h3>

							{asignaturasAnio.primero.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</div>

						<div className='bg-card rounded-lg p-4 border' id='segundo'>
							<h3 className='text-xl font-semibold mb-4'>Segundo Año</h3>

							{asignaturasAnio.segundo.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</div>

						<div className='bg-card rounded-lg p-4 border' id='tercero'>
							<h3 className='text-xl font-semibold mb-4'>Tercer Año</h3>

							{asignaturasAnio.tercero.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</div>

						<div className='bg-card rounded-lg p-4 border' id='cuarto'>
							<h3 className='text-xl font-semibold mb-4'>Cuarto Año</h3>

							{asignaturasAnio.cuarto.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</div>

						<div className='bg-card rounded-lg p-4 border' id='quinto'>
							<h3 className='text-xl font-semibold mb-4'>Quinto Año</h3>

							{asignaturasAnio.quinto.map((asig, index) => (
								<Asignatura key={index} asignatura={asig}></Asignatura>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
