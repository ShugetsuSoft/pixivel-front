import FollowProtocol from './protob/follow_pb'
import db from './idb'
import Lodash from "lodash"
import { renewAccessTokenIfExpired, getAccessToken, isLoggedIn } from './account'
import axios from "axios"
import CONFIG from '@/config.json'
import storage from "store2"
import { SnackbarProgrammatic as Snackbar } from 'buefy'

const FOLLOW_DATABASE_NAME = "follow"
const PAGE_LIMIT = 50

const syncDEBU = Lodash.debounce(async () => {
  Snackbar.open({
    duration: 2000,
    message:'关注列表上传中...',
    queue: false
  })
  await uploadFollow()
}, 2000, {
  maxWait: 10
})

export async function addFollow(user) {
  storage.set("last_follow_modify", Date.now())
  let simpleUser = Lodash.pick(user, ["id", "name", "bio"])
  simpleUser["bigUrl"] = user["image"]["bigUrl"]
  simpleUser["time"] = (new Date().getTime())
  let count = await db[FOLLOW_DATABASE_NAME].update(simpleUser["id"], simpleUser)
  if (count === 0) {
    await db[FOLLOW_DATABASE_NAME].add(simpleUser)
  }
  syncDEBU()
  return true
}

export async function deleteFollow(id) {
  storage.set("last_follow_modify", Date.now())
  await db[FOLLOW_DATABASE_NAME].delete(id)
  syncDEBU()
}

export async function countFollow() {
  return await db[FOLLOW_DATABASE_NAME].count()
}

export async function clearFollow() {
  storage.set("last_follow_modify", Date.now())
  await db[FOLLOW_DATABASE_NAME].clear()
  Snackbar.open({
    duration: 2000,
    message:'关注列表被清空。。。呜呜',
    queue: false
  })
  syncDEBU()
}

export async function getFollow(page) {
  return await db[FOLLOW_DATABASE_NAME].orderBy('time').reverse().offset(page * PAGE_LIMIT).limit(PAGE_LIMIT).toArray()
}

export async function isFollowed(id) {
  return (await db[FOLLOW_DATABASE_NAME].get(id)) !== undefined
}

export async function uploadFollow() {
  let collect = new FollowProtocol.Follows()
  await db[FOLLOW_DATABASE_NAME].toCollection().each(user => {
    let obj = new FollowProtocol.UserSimple()
    obj.setId(user.id)
    obj.setName(user.name)
    obj.setBio(user.bio)
    obj.setBigUrl(user.bigUrl)
    obj.setTime(user.time)
    collect.addUsers(obj)
  })
  collect.setTime(storage.get("last_follow_modify", 0))
  let bin = collect.serializeBinary()
  await renewAccessTokenIfExpired()
  await axios.put(CONFIG.USER_API + "follow", bin, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  })
}

export async function syncFollow() {
  Snackbar.open({
    duration: 2000,
    message:'关注列表同步中...',
    queue: false
  })

  await renewAccessTokenIfExpired()
  let res
  try {
    res = await axios.get(CONFIG.USER_API + "follow", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      responseType: 'arraybuffer'
    })
  } catch (e) {
    if (e.response.status == 404) {
      await uploadFollow()
    }
    return
  }

  let remoteData = FollowProtocol.deserializeBinary(res.data)

  let lastModifyTimeRemote = remoteData.getTime()
  let lastModifyTimeLocal = storage.get("last_follow_modify", 0)

  if (lastModifyTimeRemote == lastModifyTimeLocal) {
    return
  } else if (lastModifyTimeRemote < lastModifyTimeLocal) {
    await uploadFollow()
    return
  }

  await db[FOLLOW_DATABASE_NAME].clear()
  await Promise.all(remoteData.getUsersList().map(i => new Promise(resolve => {
    let user = i.toObject()
    db[FOLLOW_DATABASE_NAME].add(user).then(() => {
      resolve()
    })
  })))
}

if (isLoggedIn()) {
  syncFollow()
}
document.addEventListener('visibilitychange', function() {
  if (isLoggedIn()) {
    syncFollow()
  }
})