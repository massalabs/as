import { staticArrayToUint8Array } from '../serialization';

describe('arrays', () => {
  test('staticArrayToUint8Array', () => {
    const staticArray = StaticArray.fromArray<u8>([0, 1, 2, 3, 4]);
    const typedArray = staticArrayToUint8Array(myArray);

    expect(result instanceof Uint8Array).toBe(true);
    expect(result.length).toBe(myArray.length);
    for (let i = 0; i < myArray.length; i++) {
      expect(result[i]).toBe(myArray[i]);
    }
  });
});
