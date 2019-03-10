import { getTopNLocations, addToStore } from "./tweets.store";
import { generateTweet } from "../generators/create-fake-tweets.service";

describe("tweet store", () => {
  describe("topNLocations", () => {
    it("should properly sort out the top n locations", () => {
      const tweets = [];
      for (let i = 0; i < 10; i++) {
        tweets.push(generateTweet());
      }
      tweets.forEach(t => addToStore(t));

      console.log(getTopNLocations(2));
    });
  });
});
