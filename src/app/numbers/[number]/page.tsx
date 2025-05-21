import NumberPage from "@/components/number/NumberPage";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user_digit_progress } from "@/lib/schema";
import { ArabicNumeralsKeys } from "@/utils/arabicNumerals";
import { nanoid } from "nanoid";

export default function Page({
	params,
}: {
	params: { number: ArabicNumeralsKeys };
}) {
	return (
		<NumberPage
			params={params}
			logoutAction={logoutAction}
			addUserDigitProgressAction={addUserDigitProgressAction}
		/>
	);
}
export async function addUserDigitProgressAction(
	digit: number,
	accuracy: number,
): Promise<{ field: string; message: string } | undefined> {
	"use server";

	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const digitLevel = await db.query.TB_digit_level.findFirst({
			where: (table, { eq }) => eq(table.index, digit),
		});

		if (!digitLevel) {
			return { field: "digit", message: `الرقم '${digit}' غير موجود.` };
		}

		const existingProgress = await db.query.TB_user_digit_progress.findMany({
			where: (table, { and, eq }) =>
				and(eq(table.userId, user.id), eq(table.digitId, digitLevel.id)),
		});

		const attempts =
			existingProgress.length > 0
				? Math.max(...existingProgress.map((p) => p.attempts))
				: 0;

		await db.insert(TB_user_digit_progress).values({
			id: nanoid(),
			userId: user.id,
			digitId: digitLevel.id,
			accuracy,
			attempts: attempts + 1,
		});
	} catch {
		return { field: "root", message: "حدث خطأ أثناء حفظ التقدم." };
	}
}
