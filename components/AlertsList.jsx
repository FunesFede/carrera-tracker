import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function AlertsList({ alerts }) {
	const location = useLocation();
	const isLanding = location.pathname === "/";
	const filteredAlerts = alerts.filter((a) => !a?.hide);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (!isLanding) {
			setIsVisible(true);
			return;
		}

		const handleScroll = () => {
			setIsVisible(window.scrollY < 100);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLanding]);

	if (filteredAlerts.length === 0) return null;

	return (
		<div
			className={`${isLanding ? "fixed top-20 left-0 right-0 z-50" : "mt-3"} container mx-auto px-4 transition-opacity duration-500 ${
				isLanding && !isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
			}`}
		>
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
