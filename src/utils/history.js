import db from './idb'
import Lodash from "lodash"

const HISTORY_DATABASE_NAME = "history"

const PAGE_LIMIT = 50

export async function addHistory(illust) {
  let thumbIllust = Lodash.pick(illust, ["id", "height", "width", "type", "pageCount", "sanity", "title", "image"])
  thumbIllust["time"] = (new Date().getTime())
  let count = await db[HISTORY_DATABASE_NAME].update(thumbIllust["id"], thumbIllust)
  if (count === 0) {
    await db[HISTORY_DATABASE_NAME].add(thumbIllust)
  }
}

export async function countHistory() {
  return await db[HISTORY_DATABASE_NAME].count()
}

export async function clearHistory() {
  await db[HISTORY_DATABASE_NAME].clear()
}

export async function getHistory(page) {
  return await db[HISTORY_DATABASE_NAME].orderBy('time').reverse().offset(page * PAGE_LIMIT).limit(PAGE_LIMIT).toArray()
}