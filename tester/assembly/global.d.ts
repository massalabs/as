export {};

declare global {
  function error(message:string): void;
  function test(name: string, callback: () => void): void;
  function describe(name: string, callback: () => void): void;
}
