import React from "react";

import FirebaseRegister from "../../components/firebase/FirebaseRegister.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";

export default function Register({ signInSuccessFunc }) {
	return (
		<div className='bg-background flex flex-1 flex-grow items-center justify-center py-8 px-4'>
			<div className='w-full max-w-5xl'>
				<div className='grid grid-cols-1 md:grid-cols-12 gap-0'>
					<div className='md:col-span-7'>
						<Card className='border-r md:border-r-0 rounded-r-none md:rounded-l-lg'>
							<CardContent className='p-6 md:p-8'>
								<FirebaseRegister onSignInSuccess={signInSuccessFunc} />
							</CardContent>
						</Card>
					</div>
					<div className='hidden md:flex md:col-span-5 bg-card border border-l-0 rounded-r-lg items-center justify-center p-6'>
						<img draggable='false' src='/images/undraw_hello.svg' className='max-w-xs w-full' alt='Hello illustration' />
					</div>
				</div>
			</div>
		</div>
	);
}
