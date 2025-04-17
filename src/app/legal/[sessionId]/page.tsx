import LegalSessionPage from "@/components/LegalSessionPage";
import { logoutAction } from "@/lib/auth";
import { fetchLegalConversationHistoryAction } from "../page";

export default function LegalSessionPageWrapper({
	params,
}: {
	params: { sessionId: string };
}) {
	return (
		<LegalSessionPage
			logoutAction={logoutAction}
			fetchLegalConversationHistoryAction={fetchLegalConversationHistoryAction.bind(
				null,
				params.sessionId,
			)}
		/>
	);
}
