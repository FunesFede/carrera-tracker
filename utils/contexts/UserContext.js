import React, { useContext } from "react";

const UserStateContext = React.createContext();

/**
 * Hook personalizado para acceder al contexto de usuario
 * @returns {{ user: object | null, loading: boolean }}
 */
export const useUser = () => {
	const context = useContext(UserStateContext);
	if (context === undefined) {
		throw new Error("useUser debe ser usado dentro de un UserStateContext.Provider");
	}
	return context;
};

export default UserStateContext;
