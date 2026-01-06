import React from "react";

import FirebaseLogin from "../../components/firebase/FirebaseLogin.jsx";
import { useLocation } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

export default function Login({ signInSuccessFunc }) {
	const location = useLocation();
	return (
		<div className='bg-background flex flex-col flex-grow items-center justify-center min-h-screen py-8 px-4'>
			<div className='w-full max-w-5xl'>
				<div className='grid grid-cols-1 md:grid-cols-12 gap-0'>
					<div className='md:col-span-7'>
						<Card className='border-r-0 md:border-r rounded-r-none md:rounded-l-lg'>
							<CardContent className='p-6 md:p-8'>
								<FirebaseLogin onSignInSuccess={signInSuccessFunc} from={location.state?.from} />
							</CardContent>
						</Card>
					</div>
					<div className='hidden md:flex md:col-span-5 bg-card border border-l-0 rounded-r-lg items-center justify-center p-6'>
						<img draggable='false' src='/images/undraw_login.svg' className='max-w-xs w-full' alt='Login illustration' />
					</div>
				</div>
			</div>
		</div>
	);
}
