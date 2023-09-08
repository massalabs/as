
// adapted from https://gist.github.com/Juszczak/63e6d9e01decc850de03
/**
       * base64 encoding/decoding
       */

// @ts-ignore: decorator
@lazy
  const PADCHAR = "=";
// @ts-ignore: decorator
@lazy
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// @ts-ignore: decorator
@lazy
  const ALPHAVALUES = StaticArray.fromArray<u8>([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    62,
    0,
    0,
    0,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    0,
    0,
    0,
    0,
    0,
    0,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    0,
    0,
    0,
    0,
    0,
  ]);

/**
          * Encode Uint8Array as a base64 string.
          * @param bytes Byte array of type Uint8Array.
          * This function was taken from here https://github.com/near/as-base64
          * as import are not working in transformer for now
          */
export function massa_transformer_base64_encode(bytes: Uint8Array): string {
  let i: i32; let b10: u32;

  const extrabytes = (bytes.length % 3);
  let imax = bytes.length - extrabytes;
  const len = ((bytes.length / 3) as i32) * 4 + (extrabytes == 0 ? 0 : 4);
  let x = changetype<string>(__new(<usize>(len << 1), idof<string>()));

  if (bytes.length == 0) {
    return "";
  }

  let ptr = changetype<usize>(x) - 2;
  for (i = 0; i < imax; i += 3) {
    b10 =
               ((bytes[i] as u32) << 16) |
               ((bytes[i + 1] as u32) << 8) |
               (bytes[i + 2] as u32);
    store<u16>(ptr+=2, (ALPHA.charCodeAt(b10 >> 18) as u16));
    store<u16>(ptr+=2, (ALPHA.charCodeAt(((b10 >> 12) & 63)) as u16));
    store<u16>(ptr+=2, (ALPHA.charCodeAt(((b10 >> 6) & 63)) as u16));
    store<u16>(ptr+=2, (ALPHA.charCodeAt((b10 & 63)) as u16));
  }

  switch (bytes.length - imax) {
    case 1:
      b10 = (bytes[i] as u32) << 16;
      store<u16>(ptr+=2, ((ALPHA.charCodeAt(b10 >> 18)) as u16));
      store<u16>(ptr+=2, ((ALPHA.charCodeAt((b10 >> 12) & 63)) as u16));
      store<u16>(ptr+=2, ((PADCHAR.charCodeAt(0)) as u16));
      store<u16>(ptr+=2, ((PADCHAR.charCodeAt(0)) as u16));
      break;
    case 2:
      b10 = ((bytes[i] as u32) << 16) | ((bytes[i + 1] as u32) << 8);
      store<u16>(ptr+=2, ((ALPHA.charCodeAt(b10 >> 18)) as u16));
      store<u16>(ptr+=2, ((ALPHA.charCodeAt((b10 >> 12) & 63)) as u16));
      store<u16>(ptr+=2, ((ALPHA.charCodeAt((b10 >> 6) & 63)) as u16));
      store<u16>(ptr+=2, ((PADCHAR.charCodeAt(0)) as u16));
      break;
  }

  return x;
}

// @ts-ignore: decorator
@inline
function getByte64(s: string, i: u32): u32 {
  return ALPHAVALUES[s.charCodeAt(i)];
}
      