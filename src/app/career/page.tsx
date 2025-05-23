import CareerPage from "@/components/careerPage";
import { logoutAction } from "@/lib/auth";
import {
	getSectionQuestionsAction,
	processCareerAnswersAction,
} from "@/lib/ServerAction/careerExp";

export default function Career() {
	return (
		<CareerPage
			logoutAction={logoutAction}
			getSectionQuestionsAction={getSectionQuestionsAction}
			processCareerAnswersAction={processCareerAnswersAction}
		/>
	);
}
