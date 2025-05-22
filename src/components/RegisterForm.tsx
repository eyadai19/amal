"use client";

import { registerFormSchema } from "@/lib/types/authSchemas";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export default function RegisterForm({
	registerAction,
}: {
	registerAction: (
		input: z.infer<typeof registerFormSchema>,
		photoUrl: string | null,
	) => Promise<any | undefined>;
}) {
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			firstName: "",
			lastName: "",
			password: "",
			confirmPassword: "",
			age: undefined,
			releaseDate: undefined,
			sentenceDuration: undefined,
		},
	});
	const handleNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: any,
		minValue: number = 1
	  ) => {
		const value = e.target.value;
		const numValue = value === "" ? undefined : Number(value);
		
		if (numValue !== undefined && numValue < minValue) {
		  field.onChange(minValue);
		} else {
		  field.onChange(numValue);
		}
	  };

	const handleDateChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: any,
	) => {
		const value = e.target.value;
		field.onChange(value === "" ? undefined : value);
	};

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		async function checkLoginStatus() {
			try {
				const response = await fetch("/api/is_logged_in");
				if (!response.ok) {
					setIsLoading(false);
					return;
				}
				const data = await response.json();
				if (data.isLoggedIn) {
					router.push("/Profile");
				} else {
					setIsLoading(false);
				}
			} catch (error) {
				setIsLoading(false);
			}
		}

		checkLoginStatus();
	}, [router]);

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		setIsSubmitting(true);
		try {
			const error = await registerAction(values, photoUrl);
			if (error) {
				form.setError(error.field, { message: error.message });
			} else {
				router.push("/Profile");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div
		  className="flex min-h-screen items-center justify-end bg-[url('/image/authImage/loginBG.png')]"
		  style={{
			backgroundSize: "cover",
			backgroundPosition: "center",
		  }}
		>
		  <div className="w-full max-w-2xl p-8 mr-7">
			<div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100">
			  {/* Welcome text */}
			  <div className="text-center mb-6">
				<h2 className="text-3xl font-bold text-[#0a462f] mb-2">!انشئ حساب جديد</h2>
			  </div>
	
			  {/* Profile picture upload */}
			  <div className="relative mb-6 flex flex-col items-center">
				{photoUrl ? (
				  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#afafaf] bg-[#0a462f]">
					<img
					  src={photoUrl}
					  alt="Profile Preview"
					  className="h-full w-full object-cover"
					/>
				  </div>
				) : (
				  <div className="text-center">
					<label htmlFor="photo" className="relative cursor-pointer">
					  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#afafaf] bg-[#0a462f] mx-auto">
						<span className="text-lg text-white">+</span>
					  </div>
					</label>
					<div className="absolute inset-0 flex items-center justify-center opacity-0">
					  <UploadButton
						endpoint="imageUploader"
						onClientUploadComplete={(res) => {
						  const uploadedFile = res[0];
						  setPhotoUrl(uploadedFile.url);
						}}
						onUploadError={(error) => {
						  console.error("Upload failed", error);
						}}
					  />
					</div>
					<p className="text-sm text-[#0a462f] mt-2">صورة الملف الشخصي</p>
				  </div>
				)}
			  </div>
	
			  <Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				  {/* First Name & Last Name - Reversed columns */}
				  <div className="grid grid-cols-2 gap-4">
					<FormField
					  control={form.control}
					  name="lastName"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">الاسم الأخير</FormLabel>
						  <FormControl>
							<Input
							  {...field}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
					<FormField
					  control={form.control}
					  name="firstName"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">الاسم الأول</FormLabel>
						  <FormControl>
							<Input
							  {...field}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
				  </div>
	
				  {/* Username & Age - Reversed columns */}
				  <div className="grid grid-cols-2 gap-4">
					<FormField
					  control={form.control}
					  name="age"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">العمر</FormLabel>
						  <FormControl>
							<Input
							  type="number"
							  min="1"
							  value={field.value ?? ""}
							  onChange={(e) => handleNumberChange(e, field, 1)}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
					<FormField
					  control={form.control}
					  name="username"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">اسم المستخدم</FormLabel>
						  <FormControl>
							<Input
							  {...field}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
				  </div>
	
				  {/* Release Date & Sentence Duration (months) - Reversed columns */}
				  <div className="grid grid-cols-2 gap-4">
					<FormField
					  control={form.control}
					  name="sentenceDuration"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">مدة العقوبة (أشهر)</FormLabel>
						  <FormControl>
							<Input
							  type="number"
							  min="1"
							  value={field.value ?? ""}
							  onChange={(e) => handleNumberChange(e, field, 1)}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
					<FormField
					  control={form.control}
					  name="releaseDate"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">تاريخ الإفراج</FormLabel>
						  <FormControl>
							<Input
							  type="date"
							  value={field.value ?? ""}
							  onChange={(e) => handleDateChange(e, field)}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
				  </div>
	
				  {/* Password & Confirm Password - Reversed columns */}
				  <div className="grid grid-cols-2 gap-4">
					<FormField
					  control={form.control}
					  name="confirmPassword"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">تأكيد كلمة السر</FormLabel>
						  <FormControl>
							<Input
							  type="password"
							  {...field}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
					<FormField
					  control={form.control}
					  name="password"
					  render={({ field }) => (
						<FormItem className="text-right">
						  <FormLabel className="text-gray-700 block text-right">كلمة السر</FormLabel>
						  <FormControl>
							<Input
							  type="password"
							  {...field}
							  className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f] text-right"
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
				  </div>
	
				  <Button
					type="submit"
					className="w-full rounded-lg bg-[#0a462f] py-3 text-white hover:bg-[#0d5a3d] transition-colors duration-200 mt-4"
					disabled={isSubmitting}
				  >
					{isSubmitting ? (
					  <span className="flex items-center justify-center">
						<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						جاري التحميل...
					  </span>
					) : (
					  "إنشاء حساب"
					)}
				  </Button>
				</form>
			  </Form>
	
			  <div className="mt-4 text-center">
				<span className="text-sm text-gray-600">
				  لديك حساب بالفعل؟{" "}
				</span>
				<Link
				  href="/login"
				  className="text-sm font-medium text-[#568051] hover:underline"
				>
				  تسجيل الدخول
				</Link>
			  </div>
			</div>
		  </div>
		</div>
	  );
	}