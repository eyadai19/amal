import LetterPage from "@/components/letter/LetterPage";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user_alpha_progress } from "@/lib/schema";
import { ArabicLettersKeys } from "@/utils/arabicLetters";
import { nanoid } from "nanoid";

export default function LettersPage({
	params,
}: {
	params: { letter: ArabicLettersKeys };
}) {
	return (
		<LetterPage
			logoutAction={logoutAction}
			params={params}
			addUserAlphaProgressAction={addUserAlphaProgressAction}
		/>
	);
}

export async function addUserAlphaProgressAction(
	bit: string,
	accuracy: number,
): Promise<{ field: string; message: string } | undefined> {
	"use server";

	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const alphaBit = await db.query.TB_alphaBit_level.findFirst({
			where: (row, { eq }) => eq(row.bit, bit),
		});

		if (!alphaBit) {
			return { field: "bit", message: `الحرف '${bit}' غير موجود.` };
		}

		const existingProgress = await db.query.TB_user_alpha_progress.findMany({
			where: (table, { and, eq }) =>
				and(eq(table.userId, user.id), eq(table.alphaBitId, alphaBit.id)),
		});

		const attempts =
			existingProgress.length > 0
				? Math.max(...existingProgress.map((p) => p.attempts))
				: 0;

		await db.insert(TB_user_alpha_progress).values({
			id: nanoid(),
			userId: user.id,
			alphaBitId: alphaBit.id,
			accuracy,
			attempts: attempts + 1,
		});
	} catch {
		return { field: "root", message: "حدث خطأ أثناء حفظ التقدم." };
	}
}
