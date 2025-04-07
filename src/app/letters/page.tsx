import LettersPage from "@/components/letter/lettersPage";
import { logoutAction } from "@/lib/auth";

export default function lettersPage() {
	return (
		<div>
			<LettersPage logoutAction={logoutAction} />
		</div>
	);
}
