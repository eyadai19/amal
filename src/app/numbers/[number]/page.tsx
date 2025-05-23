import NumberPage from "@/components/number/NumberPage";
import { logoutAction } from "@/lib/auth";
import { ArabicNumeralsKeys } from "@/utils/arabicNumerals";

export default function Page({
	params,
}: {
	params: { number: ArabicNumeralsKeys };
}) {
	return <NumberPage params={params} logoutAction={logoutAction} />;
}
