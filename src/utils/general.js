export const context = () => {
  const canvas = document.getElementById('game');
  return {
    canvas,
    context: canvas.getContext('2d'),
  };
};
