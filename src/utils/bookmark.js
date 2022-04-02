import BookMarkProtocol from './protob/bookmark_pb'
import db from './idb'
import Lodash from "lodash"
import { renewAccessTokenIfExpired, getAccessToken } from './account'
import axios from "axios"
import CONFIG from '@/config.json'

const BOOKMARK_DATABASE_NAME = "bookmark"
const PAGE_LIMIT = 50

export async function addBookMark(illust) {
  let thumbIllust = Lodash.pick(illust, ["id", "height", "width", "type", "pageCount", "sanity", "title", "image"])
  thumbIllust["time"] = (new Date().getTime())
  let count = await db[BOOKMARK_DATABASE_NAME].update(thumbIllust["id"], thumbIllust)
  if (count === 0) {
    await db[BOOKMARK_DATABASE_NAME].add(thumbIllust)
  }
}

export async function deleteBookMark(id) {
  await db[BOOKMARK_DATABASE_NAME].delete(id)
}

export async function countBookMark() {
  return await db[BOOKMARK_DATABASE_NAME].count()
}

export async function clearBookMark() {
  await db[BOOKMARK_DATABASE_NAME].clear()
}

export async function getBookMark(page) {
  return await db[BOOKMARK_DATABASE_NAME].orderBy('time').reverse().offset(page * PAGE_LIMIT).limit(PAGE_LIMIT).toArray()
}

export async function isBookMarked(id) {
  return (await db[BOOKMARK_DATABASE_NAME].get(id)) !== undefined
}

export async function uploadBookMark() {
  let collect = new BookMarkProtocol.BookMarks()
  await db[BOOKMARK_DATABASE_NAME].orderBy('time').reverse().each(illust => {
    let obj = new BookMarkProtocol.IllustSimple()
    obj.setId(illust.id)
    obj.setHeight(illust.height)
    obj.setWidth(illust.width)
    obj.setTitle(illust.title)
    obj.setImage(illust.image)
    obj.setPagecount(illust.pageCount)
    obj.setSanity(illust.sanity)
    obj.setTime(illust.time)
    obj.setType(illust.type)
    collect.addIllusts(obj)
  })
  let bin = collect.serializeBinary()
  console.log(bin.byteLength)
  await renewAccessTokenIfExpired()
  await axios.put(CONFIG.USER_API + "bookmark", bin, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  })
}

export async function syncBookMark() {

}
