export const sleepFor = (t: number = 1000, cb?: (...args: any) => void) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb ? cb() : true);
    }, t);
  });
};
