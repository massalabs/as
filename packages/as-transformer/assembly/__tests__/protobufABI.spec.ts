describe('Protobuf ABI tests', () => {});

@exportAs("toto")
export function _sayHello(language: string, name: string): string {
  let greetings = 'Hello,' + language;

  //  switch (language) {
  //    case "french":
  //      greetings = "Bonjour,";
  //      break;
  //  }

  return greetings + name + '!';
}
