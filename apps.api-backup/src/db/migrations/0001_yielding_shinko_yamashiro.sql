CREATE TABLE "payment_stripe" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar DEFAULT '' NOT NULL,
	"username" varchar NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"day" integer NOT NULL,
	"subjects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sheets" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" boolean NOT NULL,
	"activate" boolean NOT NULL,
	"activate_code" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar NOT NULL,
	"university" varchar NOT NULL,
	"department" varchar NOT NULL,
	"exp" timestamp DEFAULT now(),
	"exp_korpor" timestamp DEFAULT now(),
	"exp_otp" timestamp DEFAULT now(),
	"subject" json DEFAULT '{"subjects":[],"sheets":[]}'::json,
	"role" json DEFAULT '["user"]'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"time" integer DEFAULT 1800,
	"activated" boolean DEFAULT false,
	"otp" varchar DEFAULT '',
	"examination_fields" json DEFAULT '[]'::json,
	"token" varchar DEFAULT '',
	"profile" varchar DEFAULT '',
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;