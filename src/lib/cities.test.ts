import { filterTweet } from "./cities";

describe("it should test", () => {
  it("should work", () => {
    const testData = {
      created_at: "Fri Feb 15 21:53:09 +0000 2019",
      id: 1096527863547719700,
      id_str: "1096527863547719686",
      text:
        "Buy/Sell altcoin moves #ethparis with up to 100x Leverage at PrimeXBT! 💰💰\n\nJoin now and trade your $75 into $7500:\n\n✅… https://t.co/wQgTcFP3DC",
      source:
        '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
      truncated: true,
      in_reply_to_status_id: null,
      in_reply_to_status_id_str: null,
      in_reply_to_user_id: null,
      in_reply_to_user_id_str: null,
      in_reply_to_screen_name: null,
      user: {
        id: 974955710231523300,
        id_str: "974955710231523328",
        name: "LisettaDarwin",
        screen_name: "DarwinLisetta",
        location: "Alabama, USA",
        url: null,
        description:
          "Creator. Wannabe food buff. Amateur beer aficionado. Troublemaker. Pop culture ninja. Introvert. Bacon specialist. Award-winning student. Coffee advocate.",
        translator_type: "none",
        protected: false,
        verified: false,
        followers_count: 2,
        friends_count: 0,
        listed_count: 0,
        favourites_count: 0,
        statuses_count: 382,
        created_at: "Sat Mar 17 10:28:49 +0000 2018",
        utc_offset: null,
        time_zone: null,
        geo_enabled: false,
        lang: "en",
        contributors_enabled: false,
        is_translator: false,
        profile_background_color: "000000",
        profile_background_image_url:
          "http://abs.twimg.com/images/themes/theme1/bg.png",
        profile_background_image_url_https:
          "https://abs.twimg.com/images/themes/theme1/bg.png",
        profile_background_tile: false,
        profile_link_color: "7FDBB6",
        profile_sidebar_border_color: "000000",
        profile_sidebar_fill_color: "000000",
        profile_text_color: "000000",
        profile_use_background_image: false,
        profile_image_url:
          "http://pbs.twimg.com/profile_images/1088019813014720513/lgkAex5-_normal.jpg",
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1088019813014720513/lgkAex5-_normal.jpg",
        default_profile: false,
        default_profile_image: false,
        following: null,
        follow_request_sent: null,
        notifications: null
      },
      geo: null,
      coordinates: null,
      place: null,
      contributors: null,
      is_quote_status: false,
      extended_tweet: {
        full_text:
          "Buy/Sell altcoin moves with #ethparis up to 100x Leverage at PrimeXBT! 💰💰\n\nJoin now and trade your $75 into $7500:\n\n✅ https://t.co/c7TUihpAa6 ✅\n\nEarn money even when it is falling! 📉📉\n\n$TUSD | $BTC | $ETH | $MONA | $LSK | $ICX | $ETH | $HC | $LINK | $ZRX https://t.co/qLNUGe6ai6",
        display_text_range: [0, 244],
        entities: { hashtags: [], symbols: [], urls: [], user_mentions: [] }
      },
      quote_count: 0,
      reply_count: 0,
      retweet_count: 0,
      favorite_count: 0,
      entities: {
        hashtags: [],
        urls: [[Object]],
        user_mentions: [],
        symbols: []
      },
      favorited: false,
      retweeted: false,
      filter_level: "low",
      lang: "en",
      timestamp_ms: "1550267589829"
    };

    const res = filterTweet(testData);
    console.log(res);
  });
});
