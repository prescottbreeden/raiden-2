import { all, equals } from 'ramda'
import { WIDTH } from '..'

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export const isOnScreen = ({
  x,
  y,
  w,
  h,
}: {
  x: number
  y: number
  w: number
  h: number
}) => {
  const vertical = y > -h && y < window.innerHeight + h
  const horizontal = x > 0 - w && x < WIDTH + w
  const onScreen = vertical && horizontal
  return onScreen
}

export const shouldFire = ({
  hp,
  x,
  y,
}: {
  hp: number
  x: number
  y: number
}) => {
  return all(equals(true), [
    y > 0 && y < window.innerHeight,
    x > 0 && x < WIDTH,
    hp > 0,
  ])
}

export const getDistance = (object1: any, object2: any) => {
  return Math.sqrt((object1.x - object2.x) ** 2 + (object1.y - object2.y) ** 2)
}

export const getPointDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export const getDistanceBetweenCenters = (obj1: any, obj2: any) => {
  const centerX1 = obj1.x - obj1.w / 2
  const centerY1 = obj1.y - obj1.h / 2
  const centerX2 = obj2.x - obj1.w / 2
  const centerY2 = obj2.y - obj1.h / 2
  const distance = getPointDistance(centerX1, centerY1, centerX2, centerY2)
  return distance
}
