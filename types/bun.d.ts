declare module 'bun:test' {
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect(value: any): any;
  export const mock: any;
}
