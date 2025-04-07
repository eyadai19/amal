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

export const TB_handwriting_alpha_exercises = pgTable(
	"handwriting_alpha_exercises",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => TB_user.id, { onDelete: "cascade" }),
		alphaBitId: text("alphaBit_id")
			.notNull()
			.references(() => TB_alphaBit_level.id, { onDelete: "cascade" }),
		accuracy: integer("accuracy").notNull().default(0),
		imageUrl: text("image_url").notNull(),
	},
);

export const TB_handwriting_digit_exercises = pgTable(
	"handwriting_digit_exercises",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => TB_user.id, { onDelete: "cascade" }),
		digitId: text("digit_id")
			.notNull()
			.references(() => TB_digit_level.id, { onDelete: "cascade" }),
		accuracy: integer("accuracy").notNull().default(0),
		imageUrl: text("image_url").notNull(),
	},
);

// جدول تمارين الصوت بالحروف الأبجدية
export const TB_voice_alpha_exercises = pgTable("voice_alpha_exercises", {
	id: text("id").primaryKey(), // المفتاح الرئيسي
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
	alphaBitId: text("alphaBit_id")
		.notNull()
		.references(() => TB_alphaBit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الحروف الأبجدية
	accuracy: integer("accuracy").notNull().default(0), // الدقة في التمرين
	audioUrl: text("audio_url").notNull(), // رابط ملف الصوت
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(), // وقت إنشاء التمرين
});

// جدول تمارين الصوت بالأرقام
// export const TB_voice_digit_exercises = pgTable("voice_digit_exercises", {
//   id: text("id").primaryKey(), // المفتاح الرئيسي
//   userId: text("user_id")
//     .notNull()
//     .references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
//   digitId: text("digit_id")
//     .notNull()
//     .references(() => TB_digit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الأرقام
//   accuracy: integer("accuracy").notNull().default(0), // الدقة في التمرين
//   audioUrl: text("audio_url").notNull(), // رابط ملف الصوت
//   createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // وقت إنشاء التمرين
// });

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
	score: integer("score").notNull().default(0),
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
	score: integer("score").notNull().default(0),
	accuracy: integer("accuracy").notNull().default(0),
	attempts: integer("attempts").notNull().default(0),
});

// // جدول السجل القانوني
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

import { relations } from "drizzle-orm";

// علاقات جدول المستخدم
export const RE_user = relations(TB_user, ({ many }) => ({
	handwritingAlphaExercises: many(TB_handwriting_alpha_exercises),
	handwritingDigitExercises: many(TB_handwriting_digit_exercises),
	voiceAlphaExercises: many(TB_voice_alpha_exercises),
	sessions: many(TB_session),
	alphaProgress: many(TB_user_alpha_progress),
	digitProgress: many(TB_user_digit_progress),
}));

// علاقات جدول تمارين الكتابة اليدوية للحروف
export const RE_handwriting_alpha_exercises = relations(
	TB_handwriting_alpha_exercises,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_handwriting_alpha_exercises.userId],
			references: [TB_user.id],
		}),
		alphaBit: one(TB_alphaBit_level, {
			fields: [TB_handwriting_alpha_exercises.alphaBitId],
			references: [TB_alphaBit_level.id],
		}),
	}),
);

// علاقات جدول تمارين الكتابة اليدوية للأرقام
export const RE_handwriting_digit_exercises = relations(
	TB_handwriting_digit_exercises,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_handwriting_digit_exercises.userId],
			references: [TB_user.id],
		}),
		digit: one(TB_digit_level, {
			fields: [TB_handwriting_digit_exercises.digitId],
			references: [TB_digit_level.id],
		}),
	}),
);

// علاقات جدول تمارين الصوت للحروف
export const RE_voice_alpha_exercises = relations(
	TB_voice_alpha_exercises,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_voice_alpha_exercises.userId],
			references: [TB_user.id],
		}),
		alphaBit: one(TB_alphaBit_level, {
			fields: [TB_voice_alpha_exercises.alphaBitId],
			references: [TB_alphaBit_level.id],
		}),
	}),
);

// علاقات جدول الجلسات
export const RE_session = relations(TB_session, ({ one }) => ({
	user: one(TB_user, {
		fields: [TB_session.userId],
		references: [TB_user.id],
	}),
}));

// علاقات جدول مستويات الحروف
export const RE_alphaBit_level = relations(TB_alphaBit_level, ({ many }) => ({
	handwritingExercises: many(TB_handwriting_alpha_exercises),
	voiceExercises: many(TB_voice_alpha_exercises),
	userProgress: many(TB_user_alpha_progress),
}));

// علاقات جدول مستويات الأرقام
export const RE_digit_level = relations(TB_digit_level, ({ many }) => ({
	handwritingExercises: many(TB_handwriting_digit_exercises),
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
