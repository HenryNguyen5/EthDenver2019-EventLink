export function getPrivateKey() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw Error("Must include private key");
  }

  return privateKey;
}
