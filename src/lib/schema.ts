import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// جدول المستخدمين
export const TB_user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	photo: text("photo"),
	age: integer("age"),
	releaseDate: timestamp("release_date", { withTimezone: true, mode: "date" }), // تاريخ الإفراج
	sentenceDuration: integer("sentence_duration"), // مدة الحكم
	createdTime: timestamp("created_time", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
	lastUpdateTime: timestamp("last_update_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
});

export const TB_skill = pgTable("skill", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
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

// جدول الأرقام
export const TB_digit_level = pgTable("digit_level", {
	id: text("id").primaryKey(),
	digit: text("digit").unique().notNull(),
	index: integer("index").unique().notNull(),
});

export const TB_user_alpha_progress = pgTable("user_alpha_progress", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	alphaBitId: text("alphaBit_id")
		.notNull()
		.references(() => TB_alphaBit_level.id, { onDelete: "cascade" }),
	accuracy: integer("accuracy").notNull().default(0),
	attempts: integer("attempts").notNull().default(0),
});

export const TB_user_digit_progress = pgTable("user_digit_progress", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	digitId: text("digit_id")
		.notNull()
		.references(() => TB_digit_level.id, { onDelete: "cascade" }),
	accuracy: integer("accuracy").notNull().default(0),
	attempts: integer("attempts").notNull().default(0),
});

// جدول السجل القانوني
export const TB_legal_history = pgTable("legal_history", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	questionIndex: integer("question_index").notNull(),
	sessionId: text("session_id").notNull(), // بدون unique
});

// جدول إجابات السجل القانوني
export const TB_legal_history_answer = pgTable("legal_history_answer", {
	id: text("id").primaryKey(),
	sessionId: text("session_id").notNull(), // بدون .references()
	answer: text("answer").notNull(),
	exception: text("exception"),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
});

export const TB_psychological_history = pgTable("psychological_history", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	sessionId: text("session_id").notNull(),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	questionIndex: integer("question_index").notNull(),
	// date: date("date").notNull(),
});

export const TB_user_cv = pgTable("user_cv", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	sessionId: text("session_id").notNull(),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	questionIndex: integer("question_index").notNull(),
	// date: date("date").notNull(),
});

export const RE_psychological_history = relations(
	TB_psychological_history,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_psychological_history.userId],
			references: [TB_user.id],
		}),
	}),
);

// علاقات جدول المستخدم
export const RE_user = relations(TB_user, ({ many }) => ({
	sessions: many(TB_session),
	alphaProgress: many(TB_user_alpha_progress),
	digitProgress: many(TB_user_digit_progress),
}));

// علاقات جدول الجلسات
export const RE_session = relations(TB_session, ({ one }) => ({
	user: one(TB_user, {
		fields: [TB_session.userId],
		references: [TB_user.id],
	}),
}));

// علاقات جدول مستويات الحروف
export const RE_alphaBit_level = relations(TB_alphaBit_level, ({ many }) => ({
	userProgress: many(TB_user_alpha_progress),
}));

// علاقات جدول مستويات الأرقام
export const RE_digit_level = relations(TB_digit_level, ({ many }) => ({
	userProgress: many(TB_user_digit_progress),
}));

// علاقات جدول تقدم المستخدم في الحروف
export const RE_user_alpha_progress = relations(
	TB_user_alpha_progress,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_user_alpha_progress.userId],
			references: [TB_user.id],
		}),
		alphaBit: one(TB_alphaBit_level, {
			fields: [TB_user_alpha_progress.alphaBitId],
			references: [TB_alphaBit_level.id],
		}),
	}),
);

// علاقات جدول تقدم المستخدم في الأرقام
export const RE_user_digit_progress = relations(
	TB_user_digit_progress,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_user_digit_progress.userId],
			references: [TB_user.id],
		}),
		digit: one(TB_digit_level, {
			fields: [TB_user_digit_progress.digitId],
			references: [TB_digit_level.id],
		}),
	}),
);

// العلاقات الجديدة

// export const RE_legal_history = relations(TB_legal_history, ({ one }) => ({
// 	user: one(TB_user, {
// 		fields: [TB_legal_history.userId],
// 		references: [TB_user.id],
// 	}),
// 	// تمت إزالة العلاقة مع legal_history_answer
// }));

// export const RE_legal_history_answer = relations(
// 	TB_legal_history_answer,
// 	({ one }) => ({
// 		user: one(TB_user, {
// 			fields: [TB_legal_history_answer.userId],
// 			references: [TB_user.id],
// 		}),
// 		// تمت إزالة العلاقة مع legal_history
// 	}),
// );
