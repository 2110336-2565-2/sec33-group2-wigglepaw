import Rand, { PRNG } from "rand-seed";

let rand = new Rand("6969");

export function resetRand() {
  rand = new Rand("6969");
}

export function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - rand.next());

  return shuffled.slice(0, num);
}

export function getRandomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(rand.next() * (max - min + 1) + min);
}
