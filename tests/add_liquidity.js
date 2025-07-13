/*** Calculation in New Position Page  ***/

// price high and low increment/decrement calculation depends on tick space
// and price range input must be rounded to tick space
// for ex: for fee 1% tick space is fixed: 200 of any pair,
// we know: tick = Math.log(price) / Math.log(1.0001),
// and price = 1.0001 ** tick
// Now if we put 10 in the any input either low or high
// it will be converted to 9.9730356
// let's see how,

const uniswap_price_factor = 1.0001;
let price_input = 10;
const tick_spacing = 200; // assuming fee 1%, so tick space is 200 fixed by uniswap
const tick = Math.log(10) / Math.log(uniswap_price_factor);
// console.log('tick: ', tick);
const multiplier_of_tick_space = Math.floor(tick / tick_spacing);
// console.log('multiplier_of_tick_space: ', multiplier_of_tick_space);
const rounded_next_tick = multiplier_of_tick_space * tick_spacing;
// console.log('rounded_next_tick: ', rounded_next_tick);
price_input = uniswap_price_factor ** rounded_next_tick;
console.log('final price input: ', price_input.toFixed(7));
/* **** */



/* Deposit amount rate while add liquidity/new position */
// assume x is ETH, y is DKFT20
let x = 1;
const price = 25000;
const price_low = 1;
const price_high = 29955.992;

const L = x * Math.sqrt(price) * Math.sqrt(price_high) / (Math.sqrt(price_high) - Math.sqrt(price));
// console.log('L: ', L);
let y = L * (Math.sqrt(price) - Math.sqrt(price_low));
y = Math.floor(y);

console.log('deposit amount of x n y: ', x, y);

// Other condition
/* 
  if (price < price_low) {
    y = 0; //no deposit amount needed for y token
  } else if (price > price_high) {
    x = 0; //no deposit amount needed for x token
  }
*/

/******/