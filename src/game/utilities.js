export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const isOnScreen = (object) => {
  const { x, y } = object;
  const onScreen =
    y > -200 && y < window.innerHeight + 200 && x > -200 && x < 1000;
  return onScreen;
};

export const getPosition = (object) => {
  let x = object.x;
  let y = object.y;
  return { x: x, y: y };
};

export const getDistance = (object1, object2) => {
  return Math.sqrt((object1.x - object2.x) ** 2 + (object1.y - object2.y) ** 2);
};

export const getPointDistance = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const getDistanceBetweenCenters = (obj1, obj2) => {
  const centerX1 = obj1.x - obj1.w / 2;
  const centerY1 = obj1.y - obj1.h / 2;
  const centerX2 = obj2.x - obj1.w / 2;
  const centerY2 = obj2.y - obj1.h / 2;
  const distance = getPointDistance(centerX1, centerY1, centerX2, centerY2);
  return distance;
};

/**
 *  compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
 */
export const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

/**
 *  curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
 */
export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

/**
 *  add :: a -> b -> a + b
 */
export const add = curry((x, y) => x + y);

/**
 *  log :: a -> a
 */
export const log = curry((name, arg) => {
  console.log(name, arg);
  return arg;
});

/**
 *  filter :: (a -> Bool) -> [a] -> [a]
 */
export const filter = curry((f, xs) => xs.filter(f));

/**
 *  map :: (a -> b) -> [a] -> [b]
 */
export const map = curry((f, xs) => xs.map(f));
