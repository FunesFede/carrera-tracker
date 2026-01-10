import React, { useEffect } from "react";
import Alerts from "../../components/admin/Alerts";
import { useNavigate } from "react-router";
import { isAdmin } from "../../utils/admin";
import { useUser } from "../../utils/contexts/UserContext";

export default function Admin() {
	const navigate = useNavigate();
	const { user } = useUser();

	useEffect(() => {
		if (!isAdmin(user?.uid)) navigate("/", { replace: true });
	});

	return (
		<div className='py-8 bg-background flex flex-col flex-grow '>
			<div className='container mx-auto px-4'>
				<Alerts />
			</div>
		</div>
	);
}
