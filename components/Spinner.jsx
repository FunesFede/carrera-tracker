import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background'>
			<Loader2 className='h-8 w-8 animate-spin text-primary' />
			<span className='sr-only'>Loading...</span>
		</div>
	);
}
