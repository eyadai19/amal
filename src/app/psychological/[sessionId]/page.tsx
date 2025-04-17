import PsychologicalSessionPage from "@/components/PsychologicalSessionPage";
import { logoutAction } from "@/lib/auth";
import { fetchPsychologicalConversationHistoryAction } from "../page";

export default function PsychologicalSesstionPage({
	params,
}: {
	params: { sessionId: string };
}) {
	return (
		<PsychologicalSessionPage
			logoutAction={logoutAction}
			fetchPsychologicalConversationHistoryAction={fetchPsychologicalConversationHistoryAction.bind(
				null,
				params.sessionId,
			)}
		/>
	);
}
