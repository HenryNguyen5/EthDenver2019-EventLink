import { twit } from "./twit";
import { StreamedTweet } from "./twit.types";
import { CITIES } from "./cities";
export function streamTweets(streamhandler: (tweet: StreamedTweet) => void) {
  const track = [CITIES.map(c => c.name).join(","), "eth"].join(",");
  console.log("Tracking current filters:", track);

  const stream = twit.stream("statuses/filter", {
    track
  });

  stream.on("tweet", streamhandler);
}
