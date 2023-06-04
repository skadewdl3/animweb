mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
extern {
    fn alert(s: &str);
    fn parseInt(s: f32) -> i32;
}


#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm!");
}



#[wasm_bindgen]
pub fn himom(string: &str) {
    use web_sys::console;
    console::log_1(&(format!("heheboi {}", string)).into());
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
