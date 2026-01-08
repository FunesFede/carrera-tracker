import React from "react";

import { useLocation } from "react-router";
import PasswordlessLogin from "../../components/firebase/PasswordlessLogin";
import { Card, CardContent } from "@/components/ui/card";

export default function PasswordlessLoginCallback({ signInSuccessFunc }) {
	const location = useLocation();
	return (
		<div className='bg-background flex flex-col flex-1 items-center justify-center  py-8 px-4'>
			<div className='w-full max-w-5xl'>
				<div className='grid grid-cols-1 md:grid-cols-12 gap-0'>
					<div className='md:col-span-7'>
						<Card className='border-r md:border-r-0 rounded-r-none md:rounded-l-lg'>
							<CardContent className='p-6 md:p-8'>
								<PasswordlessLogin signIn={true} onSignInSuccess={signInSuccessFunc} from={location} />
							</CardContent>
						</Card>
					</div>
					<div className='hidden md:flex md:col-span-5 bg-card border border-l-0 rounded-r-lg items-center justify-center p-6'>
						<img draggable='false' src='/images/undraw_envelope.svg' className='max-w-xs w-full' alt='Login illustration' />
					</div>
				</div>
			</div>
		</div>
	);
}
