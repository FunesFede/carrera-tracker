import { db } from "/firebase/config";
import { doc, setDoc, arrayUnion, arrayRemove, onSnapshot, getDoc, collection, getDocs, writeBatch, deleteField } from "firebase/firestore";
import asignaturasData from "../../data/asignaturas.json";
import { getNotasDocRef, removeNota } from "./notas";

export const getAsignaturaDocRef = (userId) => {
	return doc(db, "users", userId, "asignaturas", "data");
};

export const getAll = async () => {
	const docRef = collection(db, "users");
	return await getDocs(docRef);
};

export const getAsignaturas = (userId, callback, onError) => {
	if (!userId) {
		if (onError) onError(new Error("UserID no proporcionado."));
		return () => {};
	}

	const docRef = getAsignaturaDocRef(userId);

	const unsubscribe = onSnapshot(
		docRef,
		(docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data();
				callback({
					regularizadas: data.regularizadas || [],
					aprobadas: data.aprobadas || [],
				});
			} else {
				callback({
					regularizadas: [],
					aprobadas: [],
				});
			}
		},
		(error) => {
			console.error("Error en onSnapshot de asignaturas:", error);
			if (onError) onError(error);
		}
	);

	return unsubscribe;
};

const getAsignaturasOnce = async (userId) => {
	if (!userId) throw new Error("UserID no proporcionado para la lectura única.");
	const docRef = getAsignaturaDocRef(userId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const data = docSnap.data();
		return {
			regularizadas: data.regularizadas || [],
			aprobadas: data.aprobadas || [],
		};
	}
	return { regularizadas: [], aprobadas: [] };
};

const calcularDependencias = (acronimo, userSubjects, allAsignaturasData, toDelete = new Set()) => {
	const acroUp = acronimo.toUpperCase();
	if (toDelete.has(acroUp)) return;

	toDelete.add(acroUp);

	const dependientes = allAsignaturasData.filter(
		(asig) => (asig.regularizadas.includes(acroUp) || asig.aprobadas.includes(acroUp)) && userSubjects.has(asig.acronimo.toUpperCase())
	);

	dependientes.forEach((dep) => calcularDependencias(dep.acronimo, userSubjects, allAsignaturasData, toDelete));
};

export const borraraAsignaturaYDependencias = async (userId, acronimoInicial) => {
	const userState = await getAsignaturasOnce(userId);
	const userSubjects = new Set([...userState.regularizadas, ...userState.aprobadas]);

	const aBorrar = new Set();
	calcularDependencias(acronimoInicial, userSubjects, asignaturasData, aBorrar);

	const batch = writeBatch(db);
	const docRef = getAsignaturaDocRef(userId);
	const notasRef = getNotasDocRef(userId);

	aBorrar.forEach((acron) => {
		batch.update(docRef, {
			regularizadas: arrayRemove(acron),
			aprobadas: arrayRemove(acron),
		});

		batch.update(notasRef, { [acron]: deleteField() });
	});

	await batch.commit();
	console.log(`Se borraron ${aBorrar.size} asignaturas en una sola operación.`);
};

export const addRegularizada = async (userId, acronimo) => {
	if (!userId || !acronimo) {
		console.error("Faltan userId o acronimo.");
		return false;
	}

	const acronimoUpperCase = acronimo.toUpperCase();
	const docRef = getAsignaturaDocRef(userId);

	try {
		// arrayUnion añade el elemento solo si no existe
		await setDoc(
			docRef,
			{
				regularizadas: arrayUnion(acronimoUpperCase),
			},
			{ merge: true } // Mantiene los otros campos del documento (como 'aprobadas')
		);

		console.debug(`Añadido ${acronimoUpperCase} a regularizadas.`);
		return true;
	} catch (error) {
		console.error("Error al añadir regularizada:", error);
		return false;
	}
};

export const removeRegularizada = async (userId, acronimo) => {
	if (!userId || !acronimo) {
		console.error("Faltan userId o acronimo.");
		return false;
	}

	const acronimoUpperCase = acronimo.toUpperCase();
	const docRef = getAsignaturaDocRef(userId);

	try {
		await setDoc(
			docRef,
			{
				regularizadas: arrayRemove(acronimoUpperCase),
			},
			{ merge: true }
		);

		console.debug(`Removido ${acronimoUpperCase} de regularizadas.`);
		return true;
	} catch (error) {
		console.error("Error al quitar regularizada:", error);
		return false;
	}
};

export const addAprobada = async (userId, acronimo) => {
	if (!userId || !acronimo) return;

	const docRef = getAsignaturaDocRef(userId);
	try {
		await setDoc(
			docRef,
			{
				aprobadas: arrayUnion(acronimo.toUpperCase()),
			},
			{ merge: true }
		);
		console.debug(`Añadido ${acronimo.toUpperCase()} a aprobadas.`);
		return true;
	} catch (error) {
		console.error("Error al añadir aprobada:", error);
		return false;
	}
};

export const removeAprobada = async (userId, acronimo) => {
	if (!userId || !acronimo) return;

	const docRef = getAsignaturaDocRef(userId);
	try {
		await setDoc(
			docRef,
			{
				aprobadas: arrayRemove(acronimo.toUpperCase()),
			},
			{ merge: true }
		);
		await removeNota(userId, acronimo);
		console.debug(`Removido ${acronimo.toUpperCase()} de aprobadas.`);
		return true;
	} catch (error) {
		console.error("Error al quitar aprobada:", error);
		return false;
	}
};
