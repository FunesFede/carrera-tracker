import { Check, Hourglass, Info, ArrowLeftRight, X, Unlock, Lock } from "lucide-react";

export default function InfoBanner() {
	return (
		<>
			<div className='mb-2'>
				<h5>Guía de Botones</h5>
			</div>
			<div className='space-y-2 mb-2'>
				<div className='text-success'>
					<Check className='inline w-4 h-4 mr-1' /> Aprobar Asignatura <br /> (final rendido o AD)
				</div>
				<div className='text-warning mt-2'>
					<Hourglass className='inline w-4 h-4 mr-1' /> Regularizar Asignatura <br /> (cursada pero final no rendido)
				</div>
				<div className='text-primary mt-2'>
					<Info className='inline w-4 h-4 mr-1' /> Ver Información Detallada
				</div>
				<div className='text-primary mt-2'>
					<ArrowLeftRight className='inline w-4 h-4 mr-1' /> Ver Correlativas
				</div>
				<div className='text-danger mt-2'>
					<X className='inline w-4 h-4 mr-1' /> Eliminar Asignatura (dependientes se caen)
				</div>
			</div>
			<div className='my-4'>
				<br />
			</div>
			<div className='mb-2'>
				<h5>Guía de Iconos</h5>
			</div>
			<div className='space-y-2 mb-3'>
				<div className='text-white'>
					<Unlock className='inline w-4 h-4 mr-1' /> Asignatura Cursable
				</div>
				<div className='text-danger mt-2'>
					<Lock className='inline w-4 h-4 mr-1' /> Asignatura No Cursable
				</div>
				<div className='text-success mt-2'>
					<Check className='inline w-4 h-4 mr-1' /> Asignatura Aprobada
				</div>
				<div className='text-warning mt-2'>
					<Hourglass className='inline w-4 h-4 mr-1' /> Asignatura Regularizada
				</div>
			</div>
		</>
	);
}
