import { staticArrayToUint8Array } from '../serialization';

describe('arrays', () => {
  test('staticArrayToUint8Array', () => {
    const myArray = new StaticArray<u8>(5);
    for (let i: u8 = 0; i < 5; i++) {
      myArray[i] = i;
    }
    const result = staticArrayToUint8Array(myArray);
    expect(result instanceof Uint8Array).toBe(true);
  });
});
