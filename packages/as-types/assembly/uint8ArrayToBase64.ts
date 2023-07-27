/**
 * Converts a Uint8Array to a base64 string.
 *
 * @param bytes - The Uint8Array to convert.
 *
 * @returns The base64 string.
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  const base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  let result = '';
  let padding = '';
  let buffer = 0;
  let bitsRemaining = 8;

  for (let i = 0; i < bytes.length; i++) {
    buffer = (buffer << 8) | bytes[i];
    bitsRemaining += 8;

    while (bitsRemaining >= 6) {
      const index = (buffer >> (bitsRemaining - 6)) & 0x3f;
      result += base64Chars.charAt(index);
      bitsRemaining -= 6;
    }
  }

  return result + padding;
}
