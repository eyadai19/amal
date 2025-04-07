CREATE TABLE "legal_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"question_index" integer NOT NULL,
	"session_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_history_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"answer" text NOT NULL,
	"exception" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "legal_history" ADD CONSTRAINT "legal_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_history_answer" ADD CONSTRAINT "legal_history_answer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;