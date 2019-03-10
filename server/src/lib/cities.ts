import { StreamedTweet } from "./twit.types";

interface Coordinates {
  latitude: number;
  longitude: number;
}
interface City {
  name: string;
  coordinates: Coordinates;
}

export const CITIES: City[] = [
  {
    name: "denver",
    coordinates: { latitude: 39.742043, longitude: -104.991531 }
  },
  { name: "paris", coordinates: { latitude: 48.864716, longitude: 2.349014 } },
  {
    name: "singapore",
    coordinates: { latitude: 1.29027, longitude: 103.851959 }
  },
  {
    name: "melbourne",
    coordinates: { latitude: -37.663712, longitude: 144.844788 }
  },
  {
    name: "toronto",
    coordinates: { latitude: 43.653908, longitude: -79.384293 }
  }
];

export interface FilteredTweet {
  origin: string;
  coordinates: Coordinates;
  id: string;
  text: string;
  timestampMs: string;
}

export function filterTweet(tweet: StreamedTweet): undefined | FilteredTweet {
  try {
    for (const city of CITIES) {
      const regex = new RegExp(`#eth${city.name}`, "gi");
      if (
        tweet.text.match(regex) ||
        (tweet.extended_tweet &&
          tweet.extended_tweet.full_text &&
          tweet.extended_tweet.full_text.match(regex))
      ) {
        return {
          origin: city.name,
          coordinates: city.coordinates,
          id: tweet.id_str,
          text: tweet.text,
          timestampMs: tweet.timestamp_ms
        };
      }
    }
  } catch (e) {
    console.log(`Error filtering tweet: ${e.message}`);
  }
}
