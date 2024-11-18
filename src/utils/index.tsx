export const getIsMacEnviroment = (OS: string) => {
  return OS.includes("MAC") ? true : false;
};
