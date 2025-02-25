import { createClient } from "@supabase/supabase-js";
import "jsr:@std/dotenv/load";
import {
  Course,
  CourseComponent,
  CourseDetails,
  Subject,
  Term,
  Session,
} from "./utils/types.ts";
import { SUPABASE_URL } from "./utils/constants.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  availableSubjectsTable,
  availableTermsTable,
  courseComponentsTable,
  coursesTable,
  sessionsTable,
} from "./db/schema.ts";
import { sql } from "drizzle-orm";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = Deno.env.get("SUPABASE_KEY") as string;

const connectionString = Deno.env.get("DATABASE_URL") as string;
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { casing: "snake_case" });

export const supabase = createClient(supabaseUrl, supabaseKey);

const getAvailableTerms = async (): Promise<Term[]> => {
  console.log("Fetching available terms...");
  const res = await supabase
    .from("availableTerms")
    .select("term,value")
    .order("term", { ascending: true });
  if (res.error) {
    console.error(
      "Error: Something went wrong when fetching list of available terms",
    );
    console.log(res.error);
    console.log();
  }

  const terms = res.data as Term[];
  console.log("Available terms fetched\n");
  return terms;
};

export const getAvailableCourses = async () => {
  console.log("Fetching available courses...");
  const res = await supabase
    .from("availableCourses")
    .select("subject")
    .order("subject", { ascending: true });
  if (res.error) {
    console.error(
      "Error: Something went wrong when fetching list of available courses",
    );
    console.log(res.error);
    console.log();
  }
  const courses = res?.data?.map((course) => course.subject) as string[];
  console.log("Available courses fetched\n");
  return courses;
};

export const upsertCourseDetails = async (
  details: CourseDetails,
): Promise<void> => {
  await updateCourses(details.courses);
  await updateCourseComponents(details.courseComponents);
  await updateSessions(details.sessions);

  for (const course of details.courses) {
    console.log(`Updated details for ${course.courseCode}`);
  }
};

export const updateCourses = async (courses: Course[]) => {
  try {
    await db
      .insert(coursesTable)
      .values(courses)
      .onConflictDoUpdate({
        target: [coursesTable.courseCode, coursesTable.courseTitle],
        set: {
          courseTitle: sql`excluded.course_title`,
        },
      });
  } catch (error) {
    console.error(
      "Error: Something went wrong when inserting courses: ",
      error,
    );
  }
};

export const updateCourseComponents = async (
  courseComponents: CourseComponent[],
) => {
  try {
    await db
      .insert(courseComponentsTable)
      .values(courseComponents)
      .onConflictDoUpdate({
        target: [
          courseComponentsTable.courseCode,
          courseComponentsTable.term,
          courseComponentsTable.subSection,
        ],
        set: {
          section: sql`excluded.section`,
          type: sql`excluded.type`,
        },
      });
  } catch (error) {
    console.error(
      "Error: Something went wrong when inserting course components: ",
      error,
    );
  }
};

export const updateSessions = async (sessions: Session[]) => {
  try {
    await db.insert(sessionsTable).values(sessions);
  } catch (error) {
    console.log("Error: Something went wrong when inserting sessions: ", error);
  }
};

export const updateAvailableTerms = async (terms: Term[]): Promise<void> => {
  try {
    await db
      .insert(availableTermsTable)
      .values(terms)
      .onConflictDoUpdate({
        target: availableTermsTable.term,
        set: {
          value: sql`excluded.value`,
        },
      });

    console.log("Success: Updated available terms");
  } catch (error) {
    console.error(
      "Error: Something went wrong when updating availabe terms: ",
      error,
    );
  }
};

export const updateAvailableSubjects = async (
  subjects: Subject[],
): Promise<void> => {
  try {
    await db
      .insert(availableSubjectsTable)
      .values(subjects)
      .onConflictDoNothing();

    console.log("Success: Updated available subjects");
  } catch (error) {
    console.error(
      "Error: Something went wrong when updating availabe subjects: ",
      error,
    );
  }
};

export default getAvailableTerms;
