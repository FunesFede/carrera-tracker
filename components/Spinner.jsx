import React from "react";
import { Loader2 } from "lucide-react";

export function Spinner({ className = "" }) {
	return <Loader2 className={`h-4 w-4 animate-spin ${className}`} />;
}

export default function SpinnerR() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-background'>
			<Loader2 className='h-8 w-8 animate-spin text-primary' />
			<span className='sr-only'>Loading...</span>
		</div>
	);
}
