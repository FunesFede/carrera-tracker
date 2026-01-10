import React, { useContext } from "react";

const AsignaturasContext = React.createContext();

/**
 * Hook personalizado para acceder al contexto de asignaturas
 * @returns {{ asignaturas: object | null, setAsignaturas: function }}
 */
export const useAsignaturas = () => {
	const context = useContext(AsignaturasContext);
	if (context === undefined) {
		throw new Error("useAsignaturas debe ser usado dentro de un AsignaturasContext.Provider");
	}
	return context;
};

export default AsignaturasContext;
