import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Alerts from "../../components/admin/Alerts";
import { useNavigate } from "react-router";
import { isAdmin } from "../../utils/admin";
import UserStateContext from "../../utils/contexts/UserContext";

export default function Admin() {
	const navigate = useNavigate();
	const user = useContext(UserStateContext);

	useEffect(() => {
		if (!isAdmin(user?.uid)) navigate("/", { replace: true });
	});

	return (
		<Container className='py-3 bg-dark text-white d-flex flex-column flex-grow-1'>
			<Alerts />
		</Container>
	);
}
