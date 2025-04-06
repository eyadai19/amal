import PsychologicalSupport from "@/components/PsychologicalPage";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { TB_psychological_history } from "../../lib/schema";

export default function PsychologicalSupportPage() {
	return (
		<div>
			<PsychologicalSupport />
		</div>
	);
}

