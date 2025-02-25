CREATE POLICY "read access for all users policy" ON "available_subjects" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "read access for all users policy" ON "available_terms" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "read access for all users policy" ON "course_components" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "read access for all users policy" ON "courses" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "read access for all users policy" ON "sessions" AS PERMISSIVE FOR SELECT TO public;