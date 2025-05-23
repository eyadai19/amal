import CareerPage from "@/components/careerPage";
import { logoutAction } from "@/lib/auth";
import {
	collectCvTextsAction,
	getSectionQuestionsAction,
	processCareerAnswersAction,
} from "@/lib/ServerAction/careerExp";
import { hasCvAction } from "../cv-preview/page";

export default function Career() {
	return (
		<CareerPage
			logoutAction={logoutAction}
			getSectionQuestionsAction={getSectionQuestionsAction}
			processCareerAnswersAction={processCareerAnswersAction}
			collectCvTextsAction={collectCvTextsAction}
			hasCvAction={hasCvAction}
		/>
	);
}
