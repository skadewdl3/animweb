// The entry file of your WebAssembly module.
import sub from "./sub";

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function mul(a: i32, b: i32): i32 {
  return a * b;
}

export function subtract(a: i32, b: i32): i32 {
  return sub(a, b);
}
