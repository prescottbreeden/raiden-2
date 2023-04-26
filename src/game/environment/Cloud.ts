// import clouds from '../../assets/images/clouds.png';
// import { WIDTH } from '../..';
// import { getRandomInt } from '../utilities';
// import { newImage, publicProperty, useState } from '../../utils/general';
// import { Game } from '../Game';

// export interface ICloud {
//   h: number;
//   w: number;
//   x: number;
//   y: number;
//   img: HTMLImageElement;
// }

// export const Cloud = (game: Game) => {
//   const { readState: cloud, updateState: update } = useState<ICloud>({
//     h: 200,
//     w: 300,
//     x: getRandomInt(0, WIDTH - 300),
//     y: 0 - 200,
//     img: newImage(clouds),
//   });

//   const draw = () => {
//     update({ y: cloud('y') + game.getVelocity() });
//     game.context?.drawImage(
//       cloud('img'),
//       cloud('x'),
//       cloud('y'),
//       cloud('w'),
//       cloud('h')
//     );
//   };

//   const cloudObject = {
//     draw,
//   };
//   Object.defineProperties(cloudObject, {
//     ...publicProperty('h', () => cloud('h')),
//     ...publicProperty('w', () => cloud('w')),
//     ...publicProperty('x', () => cloud('x')),
//     ...publicProperty('y', () => cloud('y')),
//   });

//   return cloudObject;
// };
