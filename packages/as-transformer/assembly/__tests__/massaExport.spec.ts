export function test(): void {}

@massaExport()
export function SayHello(language: string, name: string): string {
  let greetings = 'Hello,' + language;
  return greetings + name + '!';
}

export function test2(): void {}
