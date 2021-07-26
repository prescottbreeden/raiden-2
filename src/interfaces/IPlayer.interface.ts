import { IShip } from './IShip.interface';

export interface IPlayer extends IShip {
  exhaustFrame: number;
  frame: number;
  hitBox: {
    a: { x: number; y: number };
    b: { x: number; y: number };
    c: { x: number; y: number };
  };
  lives: number;
  weaponStr: number;
  weaponType: string;
}
