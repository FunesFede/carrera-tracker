import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import React from "react";

export default function AlertsList({ alerts }) {
	const filteredAlerts = alerts.filter((a) => !a?.hide);

	if (filteredAlerts.length === 0) return null;

	return (
		<div className='container mx-auto px-4 mt-3'>
			<div className='space-y-2 mb-4'>
				{filteredAlerts.map((alert) => {
					const variant = alert?.type === "danger" ? "destructive" : "default";
					const Icon = alert?.type === "warning" || alert?.type === "danger" ? AlertTriangle : Info;

					return (
						<Alert key={alert.id} variant={variant}>
							<Icon className='h-7 w-7' />
							<AlertTitle className='font-bold text-lg'>{alert?.header || "Información Importante"}</AlertTitle>
							<AlertDescription className='text-md'>{alert.content}</AlertDescription>
						</Alert>
					);
				})}
			</div>
		</div>
	);
}
