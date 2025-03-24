import NumberPage from "@/components/number/NumberPage";
import { ArabicNumeralsKeys } from "@/utils/arabicNumerals";

export default function Page({
	params,
}: {
	params: { number: ArabicNumeralsKeys };
}) {
	return <NumberPage params={params} />;
}
