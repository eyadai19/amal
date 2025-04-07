import HomePage from "@/components/homePage";
import { logoutAction, lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export default function home() {
	return (
		<div>
			<HomePage logoutAction={logoutAction} />
		</div>
	);
}
