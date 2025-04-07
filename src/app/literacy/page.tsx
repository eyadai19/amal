import LiteracyPage from "@/components/literacyPage";
import { logoutAction } from "@/lib/auth";

export default function literacyPage() {
	return (
		<div>
			<LiteracyPage logoutAction={logoutAction} />
		</div>
	);
}
