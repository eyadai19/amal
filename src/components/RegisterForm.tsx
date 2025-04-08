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
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
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
	) => {
		const value = e.target.value;
		field.onChange(value === "" ? undefined : Number(value));
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
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00203F] to-[#00001a]">
			<div className="flex w-[90%] max-w-3xl items-center justify-center rounded-lg p-6 shadow-lg backdrop-blur-md">
				<div className="flex w-full flex-col items-center">
					<h2 className="m-3 text-3xl font-semibold text-white">Join us!</h2>
					<div className="w-full max-w-md rounded-lg bg-gradient-to-b from-[#003a57] to-[#004a63] p-6">
						<div className="relative mb-3 flex flex-col items-center">
							{photoUrl ? (
								<div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#afafaf] bg-[#003A63]">
									<img
										src={photoUrl}
										alt="Profile Preview"
										className="h-full w-full object-cover"
									/>
								</div>
							) : (
								<div>
									<label htmlFor="photo" className="relative cursor-pointer">
										<div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#afafaf] bg-[#003A63]">
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
												console.error("Upload failed", error); // set error
											}}
										/>
									</div>
								</div>
							)}
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="First Name"
														{...field}
														className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Last Name"
														{...field}
														className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Username"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="age"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="number"
													placeholder="Age"
													value={field.value ?? ""}
													onChange={(e) => handleNumberChange(e, field)}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
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
										<FormItem>
											<FormControl>
												<Input
													type="date"
													placeholder="Release Date"
													value={field.value ?? ""}
													onChange={(e) => handleDateChange(e, field)}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="sentenceDuration"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="number"
													placeholder="Sentence Duration (years)"
													value={field.value ?? ""}
													onChange={(e) => handleNumberChange(e, field)}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
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
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Password"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm Password"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full bg-[#ADF0D1] text-[#00203F] hover:text-[#ADF0D1]"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Creating Account..." : "Create Account"}
								</Button>
							</form>
						</Form>

						<div className="mt-4 text-center">
							<span className="text-sm text-white">
								Already have an account?{" "}
							</span>
							<Link
								href="/login"
								className="text-sm font-medium text-blue-500 hover:underline"
							>
								Login.
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
