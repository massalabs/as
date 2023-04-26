@massaExport()
export function sayHello2(language: string, name: string): string {
  let greetings = 'Hello,' + language;
  return greetings + name + '!';
}

export function test(): void {}
