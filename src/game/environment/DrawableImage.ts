import { Game } from '../Game';
import { IDrawable } from '../../interfaces/IDrawable.interface';
import { IDrawableImage } from '../../interfaces/IDrawableImage.interface';
import { publicProperty, useState } from '../../utils/general';

export function DrawableImage({
  game,
  context,
  props,
}: {
  game: Game;
  context: keyof Game;
  props: IDrawableImage;
}): IDrawable {
  const { readState, updateState } = useState<IDrawableImage>(props);

  const drawable = {
    draw: () => {
      updateState({ y: readState('y') + game.getVelocity() });
      game[context]?.drawImage(
        readState('img'),
        readState('x'),
        readState('y'),
        readState('w'),
        readState('h')
      );
    },
  };

  Object.defineProperties(drawable, {
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
  });

  return drawable;
}
