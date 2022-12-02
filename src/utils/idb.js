import Dexie from "dexie";

const PIXIVEL_DATABASE_NAME = "pixivel";
const HISTORY_DATABASE_NAME = "history";
const BOOKMARK_DATABASE_NAME = "bookmark";
const FOLLOW_DATABASE_NAME = "follow";

const db = new Dexie(PIXIVEL_DATABASE_NAME);
db.version(3).stores({
  [HISTORY_DATABASE_NAME]: "&id, time",
  [BOOKMARK_DATABASE_NAME]: "&id, time",
  [FOLLOW_DATABASE_NAME]: "&id, time",
});
db.open();

export default db;
