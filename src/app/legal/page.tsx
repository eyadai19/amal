import LegalSupport from "@/components/legalPage";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExpLegal";

export default function lettersPage() {
	return (
		<div>
			<LegalSupport ChatbotExpAction={ChatbotExpAction} />
		</div>
	);
}
