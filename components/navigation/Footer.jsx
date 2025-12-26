import React from "react";

export default function Footer() {
	// Cloudflare Pages environment variables
	const commitHash = import.meta.env.VITE_CF_PAGES_COMMIT_SHA || import.meta.env.CF_PAGES_COMMIT_SHA;
	const commitShort = commitHash ? commitHash.substring(0, 7) : null;
	const branch = import.meta.env.VITE_CF_PAGES_BRANCH || import.meta.env.CF_PAGES_BRANCH;

	return (
		<footer className='footer bg-dark-custom p-2 mt-auto text-secondary'>
			<p className='m-0'>
				Hecho con <i className='bi bi-heart-fill'></i> por Fede :)
			</p>
			<p className='m-0'>No afiliado a la Universidad Tecnológica Nacional.</p>
			<p className='m-0'>
				¿Dudas o consultas?{" "}
				<a
					className='link-underline link-underline-opacity-0'
					href='&#77;&#65;&#73;&#108;&#84;&#111;&#58;&#116;&#114;&#97;&#99;&#107;&#101;&#114;&#64;&#102;&#102;&#101;&#100;&#101;&#46;&#97;&#114;'
				>
					Ponete en contacto
				</a>
			</p>
			<p className='m-0'>
				© {new Date().getFullYear()} Fede. Todos los derechos reservados.
				{commitShort && (
					<>
						{" • "}
						<a
							href={`https://github.com/funesfede/carrera-tracker/commit/${commitHash}`}
							target='_blank'
							rel='noopener noreferrer'
							className='text-secondary text-decoration-none'
						>
							{commitShort}
						</a>
						{branch && ` (${branch})`}
					</>
				)}
			</p>
		</footer>
	);
}
