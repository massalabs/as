import { staticArrayToUint8Array } from '../serialization';

describe('arrays', () => {
  test('staticArrayToUint8Array', () => {
    const start = new StaticArray<u8>(5);
    for (let i: u8 = 0; i < 5; i++) {
      start[i] = i;
    }
    const result = staticArrayToUint8Array(start);
    expect(result instanceof Uint8Array).toBe(true);
  });
});
