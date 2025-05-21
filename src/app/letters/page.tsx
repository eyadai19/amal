import LettersPage from "@/components/letter/lettersPage";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user_digit_progress } from "@/lib/schema";
import { nanoid } from "nanoid";

export default function lettersPage() {
	return (
		<div>
			<LettersPage logoutAction={logoutAction} />
		</div>
	);
}

