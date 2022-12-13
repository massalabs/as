describe('Test Table tests', () => {
  // prettier-ignore
  checksForEachLineThatThe('sum of two integers', `arg0 + arg1`, is, `arg3`, [
    1, 2, 3,
    3, 4, 7,
    4, 5, 9,
  ]);

  // prettier-ignore
  checksForEachLineThatThe('`greater than` of two integers', `arg0 > arg1`, isFalse, [
    0, 1,
    2, 3,
  ]);
});
