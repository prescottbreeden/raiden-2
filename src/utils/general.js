export const context = () => {
  const canvas = document.getElementById('game');
  return {
    canvas,
    context: canvas.getContext('2d'),
  };
};

export const useState = (val = null) => {
  let value = val;
  const setCache = (data) => {
    value = data;
    return value;
  };
  const getCache = () => value;
  return [getCache, setCache];
};

export const value = (f) => (typeof f === 'function' ? f() : f);
