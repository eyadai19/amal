CREATE TABLE "user_cv" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"age" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"summary" text NOT NULL,
	"skills" text NOT NULL,
	"languages" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "handwriting_alpha_exercises" CASCADE;--> statement-breakpoint
DROP TABLE "handwriting_digit_exercises" CASCADE;--> statement-breakpoint
DROP TABLE "skill" CASCADE;--> statement-breakpoint
DROP TABLE "voice_alpha_exercises" CASCADE;--> statement-breakpoint
ALTER TABLE "user_cv" ADD CONSTRAINT "user_cv_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;