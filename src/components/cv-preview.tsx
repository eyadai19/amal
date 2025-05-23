"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AmalNavbar from "./amalNavbar";

export interface CVData {
	name: string;
	age: string;
	email: string;
	phone: string;
	address: string;
	summary: string;
	skills: string;
	languages: string;
}

export default function CVPreview({
	logoutAction,
	getUserCvAction,
	updateCvAction,
	deleteCvAction,
	hasCvAction,
}: {
	logoutAction: () => Promise<void>;
	getUserCvAction: () => Promise<CVData | { field: string; message: string }>;
	updateCvAction: (
		field: keyof CVData,
		value: string,
	) => Promise<{ success: boolean; message: string }>;
	deleteCvAction: () => Promise<{
		success: boolean;
		message: string;
	}>;
	hasCvAction: () => Promise<{
		hasCv: boolean;
	}>;
}) {
	const router = useRouter();
	const [cvData, setCvData] = useState<CVData | null>(null);
	const [editingField, setEditingField] = useState<keyof CVData | null>(null);
	const [editValue, setEditValue] = useState("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [dialogStates, setDialogStates] = useState<
		Record<keyof CVData, boolean>
	>({
		name: false,
		age: false,
		email: false,
		phone: false,
		address: false,
		summary: false,
		skills: false,
		languages: false,
	});

	useEffect(() => {
		const fetchCvData = async () => {
			const hasCv = await hasCvAction();
			if (!hasCv.hasCv) {
				router.push("/cvbuilder");
				return;
			}

			const result = await getUserCvAction();
			if (!("field" in result)) {
				setCvData(result);
			} else {
				router.push("/cvbuilder");
			}
		};
		fetchCvData();
	}, [getUserCvAction, hasCvAction, router]);

	const handleDownloadPDF = async () => {
		const element = document.getElementById("cv-content");
		if (!element) return;

		try {
			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: "#ffffff",
			});

			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			});

			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
			pdf.save("السيرة_الذاتية.pdf");
		} catch (error) {
			console.error("Error generating PDF:", error);
		}
	};

	const handleEdit = (field: keyof CVData) => {
		if (!cvData) return;
		setEditingField(field);
		setEditValue(cvData[field]);
		setDialogStates((prev) => ({ ...prev, [field]: true }));
	};

	const handleSaveEdit = async () => {
		if (!cvData || !editingField) return;

		const result = await updateCvAction(editingField, editValue);
		if (result.success) {
			const newData = { ...cvData, [editingField]: editValue };
			setCvData(newData);
			setEditingField(null);
			setDialogStates((prev) => ({ ...prev, [editingField]: false }));
		} else {
			// يمكن إضافة رسالة خطأ هنا
			console.error(result.message);
		}
	};

	const handleCloseDialog = (field: keyof CVData) => {
		setDialogStates((prev) => ({ ...prev, [field]: false }));
		setEditingField(null);
	};

	const handleDeleteCV = async () => {
		const result = await deleteCvAction();
		if (result.success) {
			router.push("/cvbuilder");
		} else {
			console.error(result.message);
		}
	};

	if (!cvData) return null;

	return (
		<>
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#7D1B14FF"
				activeSection={"career"}
			/>
			<div
				className="lg-pt-24 mt-20 min-h-screen bg-gray-50 p-4 pt-24 sm:p-8"
				dir="rtl"
			>
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
						<Button
							onClick={() => router.push("/Profile")}
							variant="outline"
							className="border-red-600 text-red-600 hover:bg-red-50"
						>
							العودة للحساب
						</Button>
						<div className="flex gap-4">
							<Button
								onClick={handleDownloadPDF}
								className="bg-red-600 text-white hover:bg-red-700"
							>
								تحميل PDF
							</Button>
							<Dialog
								open={isDeleteDialogOpen}
								onOpenChange={setIsDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="destructive"
										className="bg-red-600 text-white hover:bg-red-700"
									>
										<Trash2 className="ml-2 h-4 w-4" />
										حذف السيرة الذاتية
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>تأكيد الحذف</DialogTitle>
									</DialogHeader>
									<p className="py-4 text-gray-600">
										هل أنت متأكد من رغبتك في حذف السيرة الذاتية؟ لا يمكن التراجع
										عن هذا الإجراء.
									</p>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setIsDeleteDialogOpen(false)}
										>
											إلغاء
										</Button>
										<Button
											variant="destructive"
											onClick={handleDeleteCV}
											className="bg-red-600 text-white hover:bg-red-700"
										>
											حذف
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>

					<div
						id="cv-content"
						className="rounded-xl bg-white p-4 shadow-lg sm:p-8"
					>
						{/* Header */}
						<div className="mb-8 rounded-lg bg-red-50/30 p-6 text-center">
							<div className="relative">
								<h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
									{cvData.name}
								</h1>
								<Dialog
									open={dialogStates.name}
									onOpenChange={(open) => {
										if (!open) handleCloseDialog("name");
									}}
								>
									<DialogTrigger asChild>
										<button
											onClick={() => handleEdit("name")}
											className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
										>
											<Pencil size={16} />
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>تعديل الاسم</DialogTitle>
										</DialogHeader>
										<div className="mt-4">
											<Input
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												dir="rtl"
											/>
											<Button
												onClick={handleSaveEdit}
												className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
											>
												حفظ
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
							<div className="mt-4 space-y-2 text-gray-600">
								<div className="relative">
									<p>{cvData.age} سنة</p>
									<Dialog
										open={dialogStates.age}
										onOpenChange={(open) => {
											if (!open) handleCloseDialog("age");
										}}
									>
										<DialogTrigger asChild>
											<button
												onClick={() => handleEdit("age")}
												className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
											>
												<Pencil size={16} />
											</button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>تعديل العمر</DialogTitle>
											</DialogHeader>
											<div className="mt-4">
												<Input
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													type="number"
													dir="rtl"
												/>
												<Button
													onClick={handleSaveEdit}
													className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
												>
													حفظ
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
								<div className="relative">
									<p>{cvData.email}</p>
									<Dialog
										open={dialogStates.email}
										onOpenChange={(open) => {
											if (!open) handleCloseDialog("email");
										}}
									>
										<DialogTrigger asChild>
											<button
												onClick={() => handleEdit("email")}
												className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
											>
												<Pencil size={16} />
											</button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>تعديل البريد الإلكتروني</DialogTitle>
											</DialogHeader>
											<div className="mt-4">
												<Input
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													type="email"
													dir="rtl"
												/>
												<Button
													onClick={handleSaveEdit}
													className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
												>
													حفظ
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
								<div className="relative">
									<p>{cvData.phone}</p>
									<Dialog
										open={dialogStates.phone}
										onOpenChange={(open) => {
											if (!open) handleCloseDialog("phone");
										}}
									>
										<DialogTrigger asChild>
											<button
												onClick={() => handleEdit("phone")}
												className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
											>
												<Pencil size={16} />
											</button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>تعديل رقم الهاتف</DialogTitle>
											</DialogHeader>
											<div className="mt-4">
												<Input
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													dir="rtl"
												/>
												<Button
													onClick={handleSaveEdit}
													className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
												>
													حفظ
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
								<div className="relative">
									<p>{cvData.address}</p>
									<Dialog
										open={dialogStates.address}
										onOpenChange={(open) => {
											if (!open) handleCloseDialog("address");
										}}
									>
										<DialogTrigger asChild>
											<button
												onClick={() => handleEdit("address")}
												className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
											>
												<Pencil size={16} />
											</button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>تعديل العنوان</DialogTitle>
											</DialogHeader>
											<div className="mt-4">
												<Input
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													dir="rtl"
												/>
												<Button
													onClick={handleSaveEdit}
													className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
												>
													حفظ
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						</div>

						{/* Summary */}
						<div className="mb-8 rounded-lg bg-red-50/30 p-6">
							<div className="relative">
								<h2 className="mb-4 text-xl font-bold text-gray-800">
									الملخص المهني
								</h2>
								<Dialog
									open={dialogStates.summary}
									onOpenChange={(open) => {
										if (!open) handleCloseDialog("summary");
									}}
								>
									<DialogTrigger asChild>
										<button
											onClick={() => handleEdit("summary")}
											className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
										>
											<Pencil size={16} />
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>تعديل الملخص المهني</DialogTitle>
										</DialogHeader>
										<div className="mt-4">
											<Textarea
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												rows={6}
												dir="rtl"
											/>
											<Button
												onClick={handleSaveEdit}
												className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
											>
												حفظ
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
							<p className="text-gray-600">{cvData.summary}</p>
						</div>

						{/* Skills */}
						<div className="mb-8 rounded-lg bg-red-50/30 p-6">
							<div className="relative">
								<h2 className="mb-4 text-xl font-bold text-gray-800">
									المهارات والخبرات
								</h2>
								<Dialog
									open={dialogStates.skills}
									onOpenChange={(open) => {
										if (!open) handleCloseDialog("skills");
									}}
								>
									<DialogTrigger asChild>
										<button
											onClick={() => handleEdit("skills")}
											className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
										>
											<Pencil size={16} />
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>تعديل المهارات والخبرات</DialogTitle>
										</DialogHeader>
										<div className="mt-4">
											<Textarea
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												rows={6}
												dir="rtl"
											/>
											<Button
												onClick={handleSaveEdit}
												className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
											>
												حفظ
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
							<div className="whitespace-pre-line text-gray-600">
								{cvData.skills}
							</div>
						</div>

						{/* Languages */}
						<div className="rounded-lg bg-red-50/30 p-6">
							<div className="relative">
								<h2 className="mb-4 text-xl font-bold text-gray-800">اللغات</h2>
								<Dialog
									open={dialogStates.languages}
									onOpenChange={(open) => {
										if (!open) handleCloseDialog("languages");
									}}
								>
									<DialogTrigger asChild>
										<button
											onClick={() => handleEdit("languages")}
											className="absolute top-0 left-0 text-gray-400 hover:text-red-600"
										>
											<Pencil size={16} />
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>تعديل اللغات</DialogTitle>
										</DialogHeader>
										<div className="mt-4">
											<Textarea
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												rows={6}
												dir="rtl"
											/>
											<Button
												onClick={handleSaveEdit}
												className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
											>
												حفظ
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
							<div className="whitespace-pre-line text-gray-600">
								{cvData.languages}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
