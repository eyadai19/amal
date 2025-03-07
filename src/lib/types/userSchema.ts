import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TB_user } from "../schema";

export const userSchema = createSelectSchema(TB_user, {
	username: (schema) => schema.username.min(6).max(24),
	password: (schema) => schema.password.min(8).max(32),
});

export const userViewSchema = userSchema.pick({
	id: true,
	username: true,
});

export type UserView = z.infer<typeof userViewSchema>;
export type User = z.infer<typeof userSchema>;
