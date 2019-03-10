import { generateTweet } from "./create-fake-tweets.service";

describe("fake tweet generation", () => {
  it("should work", () => {
    console.log(generateTweet());
  });
});
