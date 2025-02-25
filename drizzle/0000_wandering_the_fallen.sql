CREATE TABLE "available_subjects" (
	"subject" text PRIMARY KEY NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "available_terms" (
	"term" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "available_terms_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "course_components" (
	"courseCode" text NOT NULL,
	"term" text NOT NULL,
	"subSection" text,
	"section" text NOT NULL,
	"isOpen" boolean NOT NULL,
	"type" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "course_components_courseCode_term_subSection_pk" PRIMARY KEY("courseCode","term","subSection")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"courseCode" text,
	"term" text,
	"courseTitle" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "courses_courseCode_term_pk" PRIMARY KEY("courseCode","term"),
	CONSTRAINT "courses_courseCode_unique" UNIQUE("courseCode")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"courseCode" text NOT NULL,
	"term" text NOT NULL,
	"subSection" text NOT NULL,
	"section" text NOT NULL,
	"dayOfWeek" text NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"instructor" text NOT NULL,
	"isDeleted" boolean DEFAULT false,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "course_components" ADD CONSTRAINT "course_fk" FOREIGN KEY ("courseCode","term") REFERENCES "public"."courses"("courseCode","term") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_term_available_terms_value_fk" FOREIGN KEY ("term") REFERENCES "public"."available_terms"("value") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "course_component_fk" FOREIGN KEY ("courseCode","term","subSection") REFERENCES "public"."course_components"("courseCode","term","subSection") ON DELETE cascade ON UPDATE no action;