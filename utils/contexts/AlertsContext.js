import React, { useContext } from "react";

const AlertsContext = React.createContext();

/**
 * Hook personalizado para acceder al contexto de alertas
 * @returns {Array}
 */
export const useAlerts = () => {
	const context = useContext(AlertsContext);
	if (context === undefined) {
		throw new Error("useAlerts debe ser usado dentro de un AlertsContext.Provider");
	}
	return context;
};

export default AlertsContext;
