import {WIDTH} from "..";

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const isOnScreen = (object) => {
  const {x, y, w, h} = object;
  const vertical = y > -h && y < window.innerHeight + h;
  const horizontal = x > 0 - w && x < WIDTH + w;
  const onScreen = vertical && horizontal;
  return onScreen;
};

export const shouldFire = (object) => {
  const {x, y, w, h} = object;
  const vertical = y > 0 && y < window.innerHeight;
  const horizontal = x > 0 && x < WIDTH;
  const shouldFire = vertical && horizontal;
  return shouldFire;
}

export const getPosition = (object) => {
  const x = object.x;
  const y = object.y;
  return {x, y};
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

