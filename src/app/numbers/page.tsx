import NumbersPage from "@/components/number/NumbersPage";
import { logoutAction } from "@/lib/auth";

export default function lettersPage() {
	return (
		<div>
			<NumbersPage logoutAction={logoutAction} />
		</div>
	);
}
