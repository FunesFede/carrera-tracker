import React, { useContext } from "react";

const NotasContext = React.createContext();

/**
 * Hook personalizado para acceder al contexto de notas
 * @returns {object | null}
 */
export const useNotas = () => {
	const context = useContext(NotasContext);
	if (context === undefined) {
		throw new Error("useNotas debe ser usado dentro de un NotasContext.Provider");
	}
	return context;
};

export default NotasContext;
