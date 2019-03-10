import https from "https";

export function getPgpKeysFromKeybase(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        hostname: "keybase.io",
        port: 443,
        path: `/${username}/pgp_keys.asc`
      },
      res => {
        let data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(data);
          } else {
            resolve(data);
          }
          req.end();
        });
      }
    );
    req.on("error", e => {
      reject(e);
    });
  });
}
