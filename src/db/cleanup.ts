import {
  client,
  removeCoursesWithNoSessions,
  removeOldSessions,
} from "../supabase.js";

const REMOVE_BEFORE_TIME = 5 * 60 * 60 * 1000;
await removeOldSessions(REMOVE_BEFORE_TIME);
await removeCoursesWithNoSessions();

await client.end();
