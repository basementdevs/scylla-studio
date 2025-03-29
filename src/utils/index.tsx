export const getIsMacEnviroment = (OS: string) => {
  return OS.includes("MAC") ? true : false;
};

export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  },
) => {
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
