"use client";

import { LoginFormError, loginFormSchema } from "@/lib/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export function LoginForm({
	loginAction,
}: {
	loginAction: (
		input: z.infer<typeof loginFormSchema>,
	) => Promise<LoginFormError | undefined>;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

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
					router.push("/home");
				} else {
					setIsLoading(false);
				}
			} catch (error) {
				setIsLoading(false);
			}
		}

		checkLoginStatus();
	}, [router]);

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		const error = await loginAction(values);

		if (error) {
			form.setError(
				error.field,
				{ message: error.message },
				{ shouldFocus: true },
			);
			return;
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
			<div className="mr-20 w-full max-w-xl p-8">
				<div className="rounded-xl border border-gray-100 bg-white/90 p-8 shadow-lg backdrop-blur-sm">
					{/* Welcome text */}
					<div className="mb-8 text-center">
						<h2 className="mb-2 text-3xl font-bold text-[#0a462f]">
							!مرحباً بك في أمل
						</h2>
					</div>

					{/* Login form */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem className="text-right">
										{" "}
										{/* Added text-right */}
										<FormLabel className="block text-right text-gray-700">
											اسم المستخدم
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className="w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-right text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f]"
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
										{" "}
										{/* Added text-right */}
										<FormLabel className="block text-right text-gray-700">
											كلمة السر
										</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="على الأقل 8 حروف/أرقام"
												{...field}
												className="w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-right text-gray-800 focus:border-[#0a462f] focus:ring-[#0a462f]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								disabled={form.formState.isSubmitting}
								className="w-full rounded-lg bg-[#0a462f] py-3 text-white transition-colors duration-200 hover:bg-[#0d5a3d]"
								type="submit"
							>
								{form.formState.isSubmitting ? (
									<span className="flex items-center justify-center">
										<svg
											className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										جاري التحميل...
									</span>
								) : (
									"تسجيل الدخول"
								)}
							</Button>
						</form>
					</Form>

					{/* Registration link */}
					<div className="mt-6 text-center">
						<span className="text-sm text-gray-600">ليس لديك حساب؟ </span>
						<Link
							href="/register"
							className="text-sm font-medium text-[#568051] hover:underline"
						>
							انشئ حساب جديد
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
