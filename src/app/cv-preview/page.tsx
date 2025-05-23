import CVPreview from "@/components/cv-preview";
import { logoutAction } from "@/lib/auth";

export default function CVPreviewPage() {
	return <CVPreview logoutAction={logoutAction} />;
}
