export function main(_args: string): i32 {
  /* mscl-as-transformer will read `raw_file`, encode it in base64 and put
     the result in a string used to initialize `bytes`. */
  const bytes = fileToBase64('tests/raw_file.wasm');
  return 0;
}
