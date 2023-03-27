describe('Test Table tests', () => {
  verifyTableExpectations(
    'sum of two integers',
    () => {
      expect(row0 + row1).toBe(row3, row4);
    },
    [1, 2, 3, 'i32', u8(3), u8(4), u8(7), 'u8', u16(4), u16(5), u16(9), 'u16'],
  );

  verifyTableExpectations(
    '`less than` of two integers',
    () => {
      expect(row0).toBeLessThan(row2, row3);
    },
    [0, 1, 'positive value', -2, -1, 'negative value'],
  );
});
