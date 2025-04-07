CREATE TABLE "alphaBit_level" (
	"id" text PRIMARY KEY NOT NULL,
	"bit" text NOT NULL,
	"index" integer NOT NULL,
	CONSTRAINT "alphaBit_level_bit_unique" UNIQUE("bit"),
	CONSTRAINT "alphaBit_level_index_unique" UNIQUE("index")
);
--> statement-breakpoint
CREATE TABLE "digit_level" (
	"id" text PRIMARY KEY NOT NULL,
	"digit" text NOT NULL,
	"index" integer NOT NULL,
	CONSTRAINT "digit_level_digit_unique" UNIQUE("digit"),
	CONSTRAINT "digit_level_index_unique" UNIQUE("index")
);
--> statement-breakpoint
CREATE TABLE "handwriting_alpha_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alphaBit_id" text NOT NULL,
	"accuracy" integer DEFAULT 0 NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handwriting_digit_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"digit_id" text NOT NULL,
	"accuracy" integer DEFAULT 0 NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psychological_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"question_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "skill_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"photo" text,
	"age" integer,
	"release_date" timestamp with time zone,
	"sentence_duration" integer,
	"created_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_alpha_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alphaBit_id" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"accuracy" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_digit_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"digit_id" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"accuracy" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_alpha_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alphaBit_id" text NOT NULL,
	"accuracy" integer DEFAULT 0 NOT NULL,
	"audio_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "handwriting_alpha_exercises" ADD CONSTRAINT "handwriting_alpha_exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handwriting_alpha_exercises" ADD CONSTRAINT "handwriting_alpha_exercises_alphaBit_id_alphaBit_level_id_fk" FOREIGN KEY ("alphaBit_id") REFERENCES "public"."alphaBit_level"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handwriting_digit_exercises" ADD CONSTRAINT "handwriting_digit_exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handwriting_digit_exercises" ADD CONSTRAINT "handwriting_digit_exercises_digit_id_digit_level_id_fk" FOREIGN KEY ("digit_id") REFERENCES "public"."digit_level"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psychological_history" ADD CONSTRAINT "psychological_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alpha_progress" ADD CONSTRAINT "user_alpha_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alpha_progress" ADD CONSTRAINT "user_alpha_progress_alphaBit_id_alphaBit_level_id_fk" FOREIGN KEY ("alphaBit_id") REFERENCES "public"."alphaBit_level"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_digit_progress" ADD CONSTRAINT "user_digit_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_digit_progress" ADD CONSTRAINT "user_digit_progress_digit_id_digit_level_id_fk" FOREIGN KEY ("digit_id") REFERENCES "public"."digit_level"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_alpha_exercises" ADD CONSTRAINT "voice_alpha_exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_alpha_exercises" ADD CONSTRAINT "voice_alpha_exercises_alphaBit_id_alphaBit_level_id_fk" FOREIGN KEY ("alphaBit_id") REFERENCES "public"."alphaBit_level"("id") ON DELETE cascade ON UPDATE no action;