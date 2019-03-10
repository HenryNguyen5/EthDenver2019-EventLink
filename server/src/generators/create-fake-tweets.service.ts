import loremIpsum from "lorem-ipsum";
import { FilteredTweet, CITIES } from "../lib/cities";
import { randomBytes } from "ethers/utils";

// generate a fake tweet stream and put it into the store
// to feed to the front end

function generateTweetText(cityName: string) {
  const normalizedName = [...cityName]
    .map((x, idx) => (!idx ? x.toUpperCase() : x))
    .join("");
  return [
    loremIpsum({
      count: 1, // Number of words, sentences, or paragraphs to generate.
      units: "sentences", // Generate words, sentences, or paragraphs.
      sentenceLowerBound: 5, // Minimum words per sentence.
      sentenceUpperBound: 5, // Maximum words per sentence.,
      format: "plain"
    }),
    `#ETH${normalizedName}`
  ].join(" ");
}

let next = 0;
export function generateTweet(): FilteredTweet {
  next++;
  const city =
    CITIES[next % 2 !== 0 ? 4 : Math.floor(Math.random() * CITIES.length)];
  const { coordinates, name } = city;
  const text = generateTweetText(name);
  const id = Buffer.from(randomBytes(16)).toString("hex");
  const timestampMs = Date.now().toString();
  return {
    coordinates,
    id,
    origin: name,
    text,
    timestampMs
  };
}

export function generateTweetStream(
  cb: (filteredTweet: FilteredTweet) => void,
  interval = 500
) {
  setInterval(() => cb(generateTweet()), interval);
}
