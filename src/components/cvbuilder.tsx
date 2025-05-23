"use client";

import { UserCvInfo } from "@/app/cvbuilder/page";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AmalNavbar from "./amalNavbar";
import { CVData } from "./cv-preview";

const formSchema = z.object({
	name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
	age: z.string().regex(/^\d+$/, "العمر يجب أن يكون رقماً"),
	email: z.string().email("البريد الإلكتروني غير صالح"),
	phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
	address: z.string().min(5, "العنوان يجب أن يكون أكثر من 5 أحرف"),
	summary: z.string().min(10, "الملخص يجب أن يكون أكثر من 10 أحرف"),
	skills: z.string().min(5, "المهارات يجب أن تكون أكثر من 5 أحرف"),
	languages: z.string().min(2, "اللغات يجب أن تكون أكثر من حرفين"),
});

type UserInfo = {
	name?: string;
	age?: number;
	email?: string;
	phone?: string;
	photo?: string | null;
};

export default function CVForm({
	getUserCvInfoAction,
	logoutAction,
	saveCvAction,
	hasCvAction,
}: {
	getUserCvInfoAction: () => Promise<
		UserCvInfo | { field: string; message: string }
	>;
	logoutAction: () => Promise<void>;
	saveCvAction: (
		cvData: CVData,
	) => Promise<{ success: boolean; message: string }>;
	hasCvAction: () => Promise<{
		hasCv: boolean;
	}>;
}) {
	const [userInfo, setUserInfo] = useState<UserInfo>({});
	const [experienceInput, setExperienceInput] = useState("");
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			age: "",
			email: "",
			phone: "",
			address: "",
			summary: "",
			skills: "",
			languages: "",
		},
	});

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				// التحقق من وجود سيرة ذاتية
				const hasCv = await hasCvAction();
				if (hasCv.hasCv) {
					router.push("/cv-preview");
					return;
				}

				const info = await getUserCvInfoAction();
				if ("field" in info) {
					console.error("Failed to fetch user info:", info.message);
					return;
				}
				setUserInfo(info);
				form.reset({
					name: info.name || "",
					age: info.age?.toString() || "",
					email: "",
					phone: "",
					address: "",
					summary: "",
					skills: "",
					languages: "",
				});
			} catch (error) {
				console.error("Failed to fetch user info:", error);
			}
		};

		fetchUserInfo();
	}, [getUserCvInfoAction, hasCvAction, form, router]);

	const handleAddExperience = () => {
		if (experienceInput.trim() !== "") {
			const currentSkills = form.getValues("skills");
			const newSkills = currentSkills
				? `${currentSkills}\n${experienceInput}`
				: experienceInput;
			form.setValue("skills", newSkills);
			setExperienceInput("");
		}
	};

	const handleReset = () => {
		const name = form.getValues("name");
		const age = form.getValues("age");
		form.reset({
			name,
			age,
			email: "",
			phone: "",
			address: "",
			summary: "",
			skills: "",
			languages: "",
		});
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			// تحويل القيم إلى الشكل المطلوب لـ CVData
			const cvData: CVData = {
				name: values.name,
				age: values.age.toString(),
				email: values.email,
				phone: values.phone,
				address: values.address,
				summary: values.summary,
				skills: values.skills,
				languages: values.languages,
			};

			// استدعاء دالة الحفظ
			const result = await saveCvAction(cvData);

			if (result.success) {
				// إذا نجح الحفظ، انتقل إلى صفحة المعاينة
				router.push("/cv-preview");
			} else {
				// عرض رسالة الخطأ إذا فشل الحفظ
				alert(result.message);
			}
		} catch (error) {
			console.error("Error saving CV:", error);
			alert("حدث خطأ أثناء حفظ السيرة الذاتية");
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
				className="min-h-screen bg-gradient-to-b from-red-50 to-white px-4 py-8 pt-24 sm:px-6 lg:px-10"
				dir="rtl"
			>
				<div className="mx-auto max-w-4xl">
					{/* Shorter Red Header */}
					<div className="rounded-t-xl bg-[#761515] p-4 text-white shadow-md">
						<h1 className="mb-1 text-center text-2xl font-bold">
							السيرة الذاتية
						</h1>
						<p className="text-center text-sm text-red-100">
							املأ البيانات لإنشاء سيرتك الذاتية
						</p>
					</div>

					{/* CV Form Container */}
					<div className="overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-lg">
						{/* Professional Header Section */}
						<div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-white p-6 text-center">
							<div className="mt-4 mb-3 inline-block rounded-full border-4 border-red-100 bg-white p-3 shadow-sm">
								{userInfo.photo ? (
									<img
										src={userInfo.photo}
										alt={userInfo.name || "صورة المستخدم"}
										className="h-20 w-20 rounded-full object-cover"
									/>
								) : (
									<div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
										{form.getValues("name")
											? form.getValues("name").charAt(0)
											: "?"}
									</div>
								)}
							</div>

							<h2 className="mb-1 text-xl font-bold text-gray-800">
								{form.getValues("name") || userInfo.name || "الاسم الكامل"}
							</h2>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8 p-6"
							>
								{/* Personal Information Section */}
								<div className="rounded-xl bg-red-50/50 p-6">
									<div className="grid gap-6 md:grid-cols-2">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-lg font-semibold text-gray-700">
														الاسم الكامل
													</FormLabel>
													<FormControl>
														<Input {...field} dir="rtl" />
													</FormControl>
													<FormMessage className="text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="age"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-lg font-semibold text-gray-700">
														العمر
													</FormLabel>
													<FormControl>
														<Input {...field} dir="rtl" type="number" />
													</FormControl>
													<FormMessage className="text-red-500" />
												</FormItem>
											)}
										/>
									</div>

									<div className="mt-6 grid gap-6 md:grid-cols-2">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-lg font-semibold text-gray-700">
														البريد الإلكتروني
													</FormLabel>
													<FormControl>
														<Input {...field} dir="rtl" type="email" />
													</FormControl>
													<FormMessage className="text-red-500" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-lg font-semibold text-gray-700">
														رقم الهاتف
													</FormLabel>
													<FormControl>
														<Input {...field} dir="rtl" />
													</FormControl>
													<FormMessage className="text-red-500" />
												</FormItem>
											)}
										/>
									</div>

									<div className="mt-6">
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-lg font-semibold text-gray-700">
														العنوان
													</FormLabel>
													<FormControl>
														<Input {...field} dir="rtl" />
													</FormControl>
													<FormMessage className="text-red-500" />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Professional Summary Section */}
								<div className="rounded-xl bg-red-50/50 p-6">
									<FormField
										control={form.control}
										name="summary"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-lg font-semibold text-gray-700">
													الملخص المهني
												</FormLabel>
												<FormControl>
													<textarea
														{...field}
														className="w-full rounded-lg border p-3 text-right transition focus:border-red-300 focus:ring-2 focus:ring-red-300 focus:outline-none"
														rows={4}
														dir="rtl"
													/>
												</FormControl>
												<FormMessage className="text-red-500" />
											</FormItem>
										)}
									/>
								</div>

								{/* Skills and Experience Section */}
								<div className="rounded-xl bg-red-50/50 p-6">
									<FormField
										control={form.control}
										name="skills"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-lg font-semibold text-gray-700">
													المهارات والخبرات
												</FormLabel>
												<div className="grid gap-6 md:grid-cols-3">
													<div className="md:col-span-2">
														<FormControl>
															<textarea
																{...field}
																className="h-full w-full rounded-lg border p-3 text-right transition focus:border-red-300 focus:ring-2 focus:ring-red-300 focus:outline-none"
																rows={6}
																dir="rtl"
															/>
														</FormControl>
													</div>
													<div className="flex flex-col gap-4">
														<Input
															type="text"
															value={experienceInput}
															onChange={(e) =>
																setExperienceInput(e.target.value)
															}
															placeholder="النص المراد تحويله "
															className="h-[42px] w-full rounded-lg border p-3 text-right transition focus:border-red-300 focus:ring-2 focus:ring-red-300 focus:outline-none"
															dir="rtl"
														/>
														<Button
															onClick={handleAddExperience}
															type="button"
															className="h-[42px] rounded-lg bg-red-600 px-6 py-2 text-base font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
														>
															تحويل النص الى صيغة رسمية
														</Button>
														<Dialog>
															<DialogTrigger asChild>
																<Button
																	type="button"
																	variant="outline"
																	className="h-[42px] rounded-lg border border-red-600 bg-white px-6 py-2 text-base font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50"
																>
																	ما هذا؟
																</Button>
															</DialogTrigger>
															<DialogContent className="sm:max-w-[425px]">
																<DialogHeader>
																	<DialogTitle className="text-right">
																		مثال على التحويل
																	</DialogTitle>
																</DialogHeader>
																<div className="mt-4 space-y-4 text-right">
																	<div className="rounded-lg bg-red-50 p-4">
																		<p className="font-semibold text-red-800">
																			النص الأصلي:
																		</p>
																		<p className="mt-2">
																			كنت أتعلم كيفية إدارة الوقت
																		</p>
																	</div>
																	<div className="rounded-lg bg-green-50 p-4">
																		<p className="font-semibold text-green-800">
																			بعد التحويل:
																		</p>
																		<p className="mt-2">
																			مهارات في تنظيم الوقت وتنظيم المهام
																			اليومية
																		</p>
																	</div>
																</div>
															</DialogContent>
														</Dialog>
													</div>
												</div>
												<FormMessage className="text-red-500" />
											</FormItem>
										)}
									/>
								</div>

								{/* Languages Section */}
								<div className="rounded-xl bg-red-50/50 p-6">
									<FormField
										control={form.control}
										name="languages"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-lg font-semibold text-gray-700">
													اللغات
												</FormLabel>
												<FormControl>
													<textarea
														{...field}
														className="w-full rounded-lg border p-3 text-right transition focus:border-red-300 focus:ring-2 focus:ring-red-300 focus:outline-none"
														rows={4}
														dir="rtl"
													/>
												</FormControl>
												<FormMessage className="text-red-500" />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
									<Button
										type="submit"
										className="rounded-lg bg-red-600 px-6 py-2 text-base font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
									>
										حفظ السيرة الذاتية
									</Button>
									<Button
										type="button"
										onClick={handleReset}
										className="rounded-lg border border-red-600 bg-white px-6 py-2 text-base font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50"
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
