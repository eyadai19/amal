import { z } from "zod";
import { BaseZodError } from "./errorUtilities";

export const loginFormSchema = z.object({
	username: z.string().min(8),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z
	.object({
		username: z.string().min(3, "Username must be at least 3 characters"),
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
		age: z.number().int().positive().optional().nullable(),
		releaseDate: z.string().optional().nullable(),
		sentenceDuration: z.number().int().positive().optional().nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;
