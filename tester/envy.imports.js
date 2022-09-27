export default function (memory) {
  console.log("hit");
  return {
    test: {
      imported() {
        return 42;
      },
    },
  };
}
