import React from "react";
import { Heart, Mail } from "lucide-react";

export default function Footer() {
	// Cloudflare Pages environment variables
	const commitHash = import.meta.env.VITE_CF_PAGES_COMMIT_SHA || import.meta.env.CF_PAGES_COMMIT_SHA;
	const commitShort = commitHash ? commitHash.substring(0, 7) : null;
	const branch = import.meta.env.VITE_CF_PAGES_BRANCH || import.meta.env.CF_PAGES_BRANCH;

	return (
		<footer className='bg-secondary text-secondary-foreground p-4 mt-auto'>
			<div className='container mx-auto text-center space-y-1 text-sm'>
				<p className='flex items-center justify-center gap-1'>
					Hecho con <Heart className='h-4 w-4 fill-red-500 text-red-500' /> por Fede :)
				</p>
				<p>No afiliado a la Universidad Tecnológica Nacional.</p>
				<p>
					¿Dudas o consultas?{" "}
					<a
						className='text-blue-500 dark:text-blue-400 hover:underline'
						href='&#77;&#65;&#73;&#108;&#84;&#111;&#58;&#116;&#114;&#97;&#99;&#107;&#101;&#114;&#64;&#102;&#102;&#101;&#100;&#101;&#46;&#97;&#114;'
					>
						Ponete en contacto
					</a>
				</p>
				<p>
					© {new Date().getFullYear()} Fede. Todos los derechos reservados.
					{commitShort && (
						<>
							{" • "}
							<a href={`https://github.com/funesfede/carrera-tracker/commit/${commitHash}`} target='_blank' rel='noopener noreferrer' className='hover:underline'>
								{commitShort}
							</a>
							{branch && ` (${branch})`}
						</>
					)}
				</p>
			</div>
		</footer>
	);
}
