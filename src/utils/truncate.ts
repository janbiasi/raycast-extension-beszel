export const truncateText = (value: string, maxLength = 45) => {
  if (value.length > maxLength) {
    return value.substring(0, maxLength - 3) + "...";
  }

  return value;
};
