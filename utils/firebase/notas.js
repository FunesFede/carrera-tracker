import { db } from "/firebase/config";
import { doc, setDoc, onSnapshot, getDoc, updateDoc, deleteField } from "firebase/firestore";

export const getNotasDocRef = (userId) => {
	return doc(db, "users", userId, "asignaturas", "notas");
};

export const getNotas = (userId, callback, onError) => {
	if (!userId) {
		if (onError) onError(new Error("UserID no proporcionado."));
		return () => {};
	}

	const docRef = getNotasDocRef(userId);

	const unsubscribe = onSnapshot(
		docRef,
		(docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data();
				callback(data);
			} else {
				callback({});
			}
		},
		(error) => {
			console.error("Error en onSnapshot de asignaturas:", error);
			if (onError) onError(error);
		}
	);

	return unsubscribe;
};

export const getNotasOnce = async (userId) => {
	if (!userId) throw new Error("UserID no proporcionado para la lectura única.");
	const docRef = getNotasDocRef(userId);

	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const data = docSnap.data();
		return data;
	}
	return {};
};

/**
 * Añade un acrónimo y nota, update la nota si ya existe.
 * Usa arrayUnion para evitar duplicados y sobrescribir el array.
 * @param {string} userId - ID del usuario actual.
 * @param {string} acronimo - El string a añadir (ej: 'AM').
 * @param {integer} nota - Nota a añadir
 */
export const addNota = async (userId, acronimo, nota) => {
	if (!userId || !acronimo || !nota) {
		console.error("ERROR addNota: Faltan argumentos");
		return false;
	}

	const acronimoUp = acronimo.toUpperCase();
	const docRef = getNotasDocRef(userId);

	try {
		await setDoc(
			docRef,
			{
				[acronimoUp]: Number(nota),
			},
			{ merge: true }
		);
		return true;
	} catch (error) {
		console.error("addNota error: ", error);
		return false;
	}
};

/**
 * Remove nota a partir de acronimo
 * @param {string} userId - La ID del usuario
 * @param {string} acronimo - Acronimo de la asignatura
 * @returns {boolean} Si la eliminacion fue exitosa o no
 */
export const removeNota = async (userId, acronimo) => {
	if (!userId || !acronimo) {
		console.error("removeNota: Faltan argumentos");
		return false;
	}

	const docRef = getNotasDocRef(userId);
	const acronimoUp = acronimo.toUpperCase();

	try {
		await updateDoc(docRef, {
			[acronimoUp]: deleteField(),
		});
	} catch (error) {
		console.error(error);
		return false;
	}
};
