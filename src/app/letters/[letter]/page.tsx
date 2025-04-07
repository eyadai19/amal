import LetterPage from "@/components/letter/LetterPage";
import { logoutAction } from "@/lib/auth";
import { ArabicLettersKeys } from "@/utils/arabicLetters";

export default function LettersPage({
	params,
}: {
	params: { letter: ArabicLettersKeys };
}) {
	return <LetterPage logoutAction={logoutAction} params={params} />;
}
