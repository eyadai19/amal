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
ALTER TABLE "handwriting_alpha_exercises" ADD CONSTRAINT "handwriting_alpha_exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handwriting_alpha_exercises" ADD CONSTRAINT "handwriting_alpha_exercises_alphaBit_id_alphaBit_level_id_fk" FOREIGN KEY ("alphaBit_id") REFERENCES "public"."alphaBit_level"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handwriting_digit_exercises" ADD CONSTRAINT "handwriting_digit_exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handwriting_digit_exercises" ADD CONSTRAINT "handwriting_digit_exercises_digit_id_digit_level_id_fk" FOREIGN KEY ("digit_id") REFERENCES "public"."digit_level"("id") ON DELETE cascade ON UPDATE no action;