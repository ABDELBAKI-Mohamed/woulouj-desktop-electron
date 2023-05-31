export const getRightPath = (path: string, param: string) => {
  let pathArray = path
    .split("/")
    .splice(0, useRoute().path.split("/").length - 1);
  return pathArray.concat([param]).join("/");
};
