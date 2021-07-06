export const Sound = (src) => {
  const sound = new Audio(src);
  return {
    play: () => sound.play(),
  };
};
