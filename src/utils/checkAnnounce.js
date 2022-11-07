import storage from "store2";
import CONFIG from "@/config.json";
import axios from "axios";
import Lodash from "lodash";

const AnnounceKey = "announce";

export default async function () {
  const response = await axios.get(CONFIG["ANNOUNCE_API"]);
  const newAnno = response.data;
  const oldAnno = JSON.parse(storage.get(AnnounceKey, "{}"));

  const theNew = Lodash.difference(Object.keys(newAnno), Object.keys(oldAnno));
  if (theNew.length > 0) {
    storage.set(AnnounceKey, JSON.stringify(newAnno));
  }
  return [theNew, newAnno];
}
