import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const TB_user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	photo: text("photo"),
	createdTime: timestamp("created_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
	lastUpdateTime: timestamp("last_update_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
});

export const TB_session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const TB_alphaBit_level = pgTable("alphaBit_level", {
	id: text("id").primaryKey(),
	bit: text("bit").unique().notNull(),
	index: integer("index").unique().notNull(),
});

export const TB_digit_level = pgTable("digit_level", {
	id: text("id").primaryKey(),
	digit: text("digit").unique().notNull(),
	index: integer("index").unique().notNull(),
});

export const TB_user_t3 = pgTable("user_t3", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	alphaBitId: text("alphaBit_id")
		.notNull()
		.references(() => TB_alphaBit_level.id, { onDelete: "cascade" }),
	digitId: text("digit_it")
		.notNull()
		.references(() => TB_digit_level.id, { onDelete: "cascade" }),
});
