import LetterPage from "@/components/letter/LetterPage";
import { ArabicLettersKeys } from "@/utils/arabicLetters";

export default function LettersPage({
	params,
}: {
	params: { letter: ArabicLettersKeys };
}) {
	return <LetterPage params={params} />;
}
