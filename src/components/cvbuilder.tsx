"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AmalNavbar from "./amalNavbar";
import { CVData } from "./cv-preview";

interface CVData {
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
	saveCvAction,
}: {
	logoutAction: () => Promise<void>;
	saveCvAction: (
		cvData: CVData,
	) => Promise<{ success: boolean; message: string }>;
}) {
	const [userInfo, setUserInfo] = useState<UserInfo>({});
	const [experienceInput, setExperienceInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const [cvData, setCvData] = useState<CVData | null>(null);
	const [editingField, setEditingField] = useState<keyof CVData | null>(null);
	const [editValue, setEditValue] = useState("");
	const [dialogStates, setDialogStates] = useState<Record<keyof CVData, boolean>>({
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
		const storedData = localStorage.getItem("cvData");
		if (storedData) {
			setCvData(JSON.parse(storedData));
		} else {
			router.push("/cvbuilder");
		}
	}, [router]);

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
		setDialogStates(prev => ({ ...prev, [field]: true }));
	};

	const handleSaveEdit = () => {
		if (!cvData || !editingField) return;
		const newData = { ...cvData, [editingField]: editValue };
		setCvData(newData);
		localStorage.setItem("cvData", JSON.stringify(newData));
		setEditingField(null);
		setDialogStates(prev => ({ ...prev, [editingField]: false }));
	};

	const handleCloseDialog = (field: keyof CVData) => {
		setDialogStates(prev => ({ ...prev, [field]: false }));
		setEditingField(null);
	};

	if (!cvData) return null;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsSubmitting(true);
			const result = await saveCvAction(values);

			if (result.success) {
				// Save CV data to localStorage for preview
				localStorage.setItem("cvData", JSON.stringify(values));
				// Navigate to preview page
				router.push("/cv-preview");
			} else {
				// Handle error
				console.error("Failed to save CV:", result.message);
				// You might want to show an error message to the user here
			}
		} catch (error) {
			console.error("Error saving CV:", error);
			// Handle error
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#7D1B14FF"
				activeSection={"career"}
			/>
			<div
				className="lg-pt-24 min-h-screen bg-gray-50 p-4 pt-24 sm:p-8"
				dir="rtl"
			>
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
						<Button
							onClick={() => router.push("/cvbuilder")}
							variant="outline"
							className="border-red-600 text-red-600 hover:bg-red-50"
						>
							العودة للتعديل
						</Button>
						<Button
							onClick={handleDownloadPDF}
							className="bg-red-600 text-white hover:bg-red-700"
						>
							تحميل PDF
						</Button>
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
								<div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
									<Button
										type="submit"
										className="rounded-lg bg-red-600 px-6 py-2 text-base font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
										disabled={isSubmitting}
									>
										{isSubmitting ? "جاري الحفظ..." : "حفظ السيرة الذاتية"}
									</Button>
									<Button
										type="button"
										onClick={handleReset}
										className="rounded-lg border border-red-600 bg-white px-6 py-2 text-base font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50"
										disabled={isSubmitting}
									>
										إفراغ البيانات
									</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
}