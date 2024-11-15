export const getIsMacEnviroment = (OS: string) => {
  return OS.includes("Mac") ? true : false;
};
