import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// جدول المستخدمين
export const TB_user = pgTable("user", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  username: text("username").notNull().unique(), // اسم المستخدم
  password: text("password").notNull(), // كلمة المرور
  firstName: text("first_name").notNull(), // الاسم الأول
  lastName: text("last_name").notNull(), // الاسم الأخير
  photo: text("photo"), // صورة المستخدم
  age: integer("age"), // العمر
  entryDate: timestamp("entry_date", { withTimezone: true, mode: "date" }), // تاريخ الانضمام
  releaseDate: timestamp("release_date", { withTimezone: true, mode: "date" }), // تاريخ الإفراج
  sentenceDuration: integer("sentence_duration"), // مدة الحكم
  createdTime: timestamp("created_time", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(), // وقت الإنشاء
  lastUpdateTime: timestamp("last_update_time", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(), // وقت آخر تحديث
});

// جدول المهارات
export const TB_skill = pgTable("skill", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  name: text("name").notNull().unique(), // اسم المهارة مثل "البرمجة"
  description: text("description"), // وصف المهارة
});

// جدول تمارين الكتابة اليدوية بالحروف الأبجدية
export const TB_handwriting_alpha_exercises = pgTable("handwriting_alpha_exercises", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  userId: text("user_id")
    .notNull()
    .references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين، عند حذف المستخدم يتم حذف التمرين
  alphaBitId: text("alphaBit_id")
    .notNull()
    .references(() => TB_alphaBit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الحروف الأبجدية
  accuracy: integer("accuracy").notNull().default(0), // الدقة في التمرين
  imageUrl: text("image_url").notNull(), // رابط صورة المحاولة
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // وقت إنشاء التمرين
});

// جدول تمارين الكتابة اليدوية بالأرقام
export const TB_handwriting_digit_exercises = pgTable("handwriting_digit_exercises", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  userId: text("user_id")
    .notNull()
    .references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
  digitId: text("digit_id")
    .notNull()
    .references(() => TB_digit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الأرقام
  accuracy: integer("accuracy").notNull().default(0), // الدقة في التمرين
  imageUrl: text("image_url").notNull(), // رابط صورة المحاولة
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // وقت إنشاء التمرين
});

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
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // وقت إنشاء التمرين
});

// جدول تمارين الصوت بالأرقام
export const TB_voice_digit_exercises = pgTable("voice_digit_exercises", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  userId: text("user_id")
    .notNull()
    .references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
  digitId: text("digit_id")
    .notNull()
    .references(() => TB_digit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الأرقام
  accuracy: integer("accuracy").notNull().default(0), // الدقة في التمرين
  audioUrl: text("audio_url").notNull(), // رابط ملف الصوت
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // وقت إنشاء التمرين
});

// جدول الجلسات
export const TB_session = pgTable("session", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  userId: text("user_id")
    .notNull()
    .references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(), // وقت انتهاء الجلسة
});

// جدول الحروف الأبجدية
export const TB_alphaBit_level = pgTable("alphaBit_level", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  bit: text("bit").unique().notNull(), // الحرف الأبجدي
  index: integer("index").unique().notNull(), // ترتيب الحرف
});

// جدول الأرقام
export const TB_digit_level = pgTable("digit_level", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  digit: text("digit").unique().notNull(), // الرقم
  index: integer("index").unique().notNull(), // ترتيب الرقم
});

// تقدم المستخدم في الحروف الأبجدية
export const TB_user_alpha_progress = pgTable("user_alpha_progress", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  userId: text("user_id").notNull().references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
  alphaBitId: text("alphaBit_id").notNull().references(() => TB_alphaBit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الحروف الأبجدية
  score: integer("score").notNull().default(0), // درجة التقدم في الحرف
  accuracy: integer("accuracy").notNull().default(0), // الدقة كنسبة مئوية
  attempts: integer("attempts").notNull().default(0), // عدد المحاولات
  lastProgressDate: timestamp("last_progress_date", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // تاريخ آخر تقدم
});

// تقدم المستخدم في الأرقام
export const TB_user_digit_progress = pgTable("user_digit_progress", {
  id: text("id").primaryKey(), // المفتاح الرئيسي
  userId: text("user_id").notNull().references(() => TB_user.id, { onDelete: "cascade" }), // علاقة مع جدول المستخدمين
  digitId: text("digit_id").notNull().references(() => TB_digit_level.id, { onDelete: "cascade" }), // علاقة مع جدول الأرقام
  score: integer("score").notNull().default(0), // درجة التقدم في الرقم
  accuracy: integer("accuracy").notNull().default(0), // الدقة كنسبة مئوية
  attempts: integer("attempts").notNull().default(0), // عدد المحاولات
  lastProgressDate: timestamp("last_progress_date", { withTimezone: true, mode: "date" }).notNull().defaultNow(), // تاريخ آخر تقدم
});
