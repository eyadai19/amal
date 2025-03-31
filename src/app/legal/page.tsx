import LegalSupport from "@/components/legalPage";
import { ChatbotExpAction } from "@/lib/ServerAction/expSys";

export default function lettersPage() {
	return (
		<div>
			<LegalSupport ChatbotExpAction={ChatbotExpAction} />
		</div>
	);
}
