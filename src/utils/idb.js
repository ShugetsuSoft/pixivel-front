import Dexie from 'dexie'

const PIXIVEL_DATABASE_NAME = "pixivel"
const HISTORY_DATABASE_NAME = "history"
const BOOKMARK_DATABASE_NAME = "bookmark"

const db = new Dexie(PIXIVEL_DATABASE_NAME)
db.version(2).stores({
  [HISTORY_DATABASE_NAME]: "&id, time",
  [BOOKMARK_DATABASE_NAME]: "&id, time"
})
db.open()

export default db