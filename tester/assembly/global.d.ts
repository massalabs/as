export {};

declare global {
  function error(message:string): void;
  function test(name: string, callback: () => void): void;
  function describe(name: string, callback: () => void): void;

  function check<T, U>(name: string, callback: (T)=>V, arg1: T, expected: U):void;
  function check<T>(name: string, callback: ()=>T, expected: T):void;
  function check<T>(name: string, callback: T):void;
}
