import { staticArrayToUint8Array } from '../serialization';

describe('arrays', () => {
  test('staticArrayToUint8Array', () => {
    const staticArray = StaticArray.fromArray<u8>([0, 1, 2, 3, 4]);
    const typedArray = staticArrayToUint8Array(staticArray);

    expect(typedArray instanceof Uint8Array).toBe(true);
    expect(typedArray.length).toBe(typedArray.length);

    for (let i = 0; i < staticArray.length; i++) {
      expect(typedArray[i]).toBe(staticArray[i]);
    }

    typedArray[0] = 10;
    expect(typedArray[0]).toBe(<u8>10);
  });
});
