import { FilteredTweet } from "../lib/cities";

export interface FilteredTweetStore {
  [key: string]: FilteredTweet[];
}

export const filteredTweetStore: FilteredTweetStore = {};

export function addToStore(tweet?: FilteredTweet, store = filteredTweetStore) {
  if (!tweet) {
    return;
  }
  if (!store[tweet.origin]) {
    store[tweet.origin] = [];
  }
  // console.log(`Adding tweet to store: ${JSON.stringify(tweet, null, 1)}`);
  store[tweet.origin].push(tweet);
}

export function getTopNLocations(n: number, store = filteredTweetStore) {
  return Object.values(store)
    .sort((a, b) => {
      const alen = a.length;
      const blen = b.length;
      if (alen === blen) {
        return 0;
      }
      if (alen > blen) {
        return -1;
      }
      return 1;
    })
    .slice(0, n);
}
