mod utils;

use wasm_bindgen::prelude::*;
mod quadtree;

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
pub fn test (expression: &str, start: f64, end: f64) {
    use exmex::prelude::*;
    use web_sys::console;
    use js_sys::Float64Array;
    let parsed = exmex::parse::<f64>(expression).expect("A valid value was not returned");

    let step = 0.0001;
    let length: u32 = ((end - start) / step) as u32;


    let arr: Float64Array = Float64Array::new_with_length(length);

    for i in 0..length {
        let result = parsed.eval(&[i as f64 * step]).expect("Error in evaluation");
        arr.fill(result.to_string().parse::<f64>().unwrap(), i, i + 1);
    }

    console::log_1(&arr.into());
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}
