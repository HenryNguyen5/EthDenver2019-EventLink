import { streamTweets } from "../lib/twitter-stream";
import { filterTweet } from "../lib/cities";
import { addToStore } from "../store/tweets.store";
import { generateTweetStream } from "../generators/create-fake-tweets.service";

export function runTweetService(mock: boolean) {
  if (mock) {
    generateTweetStream(filteredTweet => {
      addToStore(filteredTweet);
    });
  } else {
    streamTweets(tweet => {
      const filteredTweet = filterTweet(tweet);
      addToStore(filteredTweet);
    });
  }
}
