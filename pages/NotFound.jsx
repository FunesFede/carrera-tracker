import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFound() {
	const navigate = useNavigate();
	return (
		<div className='py-8 bg-background flex flex-col flex-grow  items-center justify-center'>
			<div className='text-center px-4'>
				<h1 className='text-6xl font-bold mb-4'>
					404: <span className='text-red-500'>Not Found</span>
				</h1>
				<h2 className='text-2xl mb-8'>
					No encontramos eso, ¿
					<a target='_blank' className='text-red-600 dark:text-red-500 hover:underline' href='https://www.youtube.com/watch?v=FPixzRVB1Vs'>
						estamos perdidas
					</a>
					?
				</h2>
				<Button variant='outline' onClick={() => navigate("/home")}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver
				</Button>
			</div>
		</div>
	);
}
