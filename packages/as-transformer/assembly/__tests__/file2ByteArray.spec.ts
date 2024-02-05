import { stringToBytes } from '@massalabs/as-types';

describe('File_to_Byte_Array transformer test', () => {
  test('File_to_Byte_Array', () => {
    // @ts-ignore
    const bytes: StaticArray<u8> = fileToByteArray(
      'packages/as-transformer/assembly/__tests__/fixtures/yolo',
    );
    expect(bytes).toStrictEqual(stringToBytes('YOLO\n'));
  });
});
