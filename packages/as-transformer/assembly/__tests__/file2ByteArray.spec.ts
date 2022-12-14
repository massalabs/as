function strToStaticArray(str: string): StaticArray<u8> {
  return changetype<StaticArray<u8>>(String.UTF8.encode(str));
}

describe('File_to_Byte_Array transformer test', () => {
  test('File_to_Byte_Array', () => {
    const bytes: StaticArray<u8> = fileToByteArray(
      'packages/as-transformer/assembly/__tests__/fixtures/yolo',
    );
    expect(bytes).toStrictEqual(strToStaticArray('YOLO\n'));
  });
});
