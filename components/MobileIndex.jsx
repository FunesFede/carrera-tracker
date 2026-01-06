import React from "react";
import { HandMetal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MobileIndex() {
	return (
		<div className='show-mobile mb-3 container-rounded-dark p-2'>
			<h4 className='text-start mx-2'>
				<HandMetal className='inline w-5 h-5 mr-1' /> Acceso Rápido
			</h4>
			<div className='flex items-center flex-wrap'>
				<a href='#primero' className='no-underline m-1'>
					<Badge variant='secondary' className='px-3 py-2'>
						Primero
					</Badge>
				</a>
				<a href='#segundo' className='no-underline m-1'>
					<Badge variant='secondary' className='px-3 py-2'>
						Segundo
					</Badge>
				</a>
				<a href='#tercero' className='no-underline m-1'>
					<Badge variant='secondary' className='px-3 py-2'>
						Tercero
					</Badge>
				</a>
				<a href='#cuarto' className='no-underline m-1'>
					<Badge variant='secondary' className='px-3 py-2'>
						Cuarto
					</Badge>
				</a>
				<a href='#quinto' className='no-underline m-1'>
					<Badge variant='secondary' className='px-3 py-2'>
						Quinto
					</Badge>
				</a>
			</div>
		</div>
	);
}
