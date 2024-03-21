import storage from "store2";
import CONFIG from "@/config.json";
import axios from "axios";
import Lodash from "lodash";

const AnnounceKey = "announce";
const MainAnnounceKey = "mainAnnounce";

export default async function () {
  const response = await axios.get(CONFIG["ANNOUNCE_API"]);
  const newAnno = response.data["board"];
  const mainAnno = response.data["main"];

  const oldAnno = JSON.parse(storage.get(AnnounceKey, "{}"));

  const theNew = Lodash.difference(Object.keys(newAnno), Object.keys(oldAnno));
  const theOld = Lodash.difference(Object.keys(oldAnno), Object.keys(newAnno));
  if (theNew.length > 0 || theOld.length > 0) {
    storage.set(AnnounceKey, JSON.stringify(newAnno));
  }

  const lastMainAnno = JSON.parse(storage.get(MainAnnounceKey, "{}"));
  if (Object.keys(lastMainAnno).length > 0) {
    if (lastMainAnno["title"] !== mainAnno["title"]) {
      storage.set(MainAnnounceKey, JSON.stringify(mainAnno));
      return [theNew, newAnno, mainAnno];
    }
  } else {
    storage.set(MainAnnounceKey, JSON.stringify(mainAnno));
    return [theNew, newAnno, mainAnno];
  }

  return [theNew, newAnno, {}];
}
