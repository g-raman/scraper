ALTER TABLE "courses" ALTER COLUMN "course_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "term" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "course_components" ADD CONSTRAINT "course_components_courseCode_unique" UNIQUE("course_code");--> statement-breakpoint
ALTER TABLE "course_components" ADD CONSTRAINT "course_components_term_unique" UNIQUE("term");--> statement-breakpoint
ALTER TABLE "course_components" ADD CONSTRAINT "course_components_subSection_unique" UNIQUE("sub_section");--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_term_unique" UNIQUE("term");