import { Color, Icon, type Image } from "@raycast/api";

export const getUpDownIndicatorIcon = (status: string): Image.ImageLike | undefined => {
  switch (status) {
    case "up":
      return { source: Icon.CircleFilled, tintColor: Color.Green };
    case "down":
      return { source: Icon.CircleDisabled, tintColor: Color.Red };
    default:
      return undefined;
  }
};

export const getSystemLoadIndicatorIcon = (loadAverage: number): Image.ImageLike => {
  if (loadAverage > 88) {
    return {
      source: Icon.CircleProgress100,
      tintColor: Color.Red,
    };
  } else if (loadAverage > 75) {
    return {
      source: Icon.CircleProgress75,
      tintColor: Color.Orange,
    };
  } else if (loadAverage > 50) {
    return {
      source: Icon.CircleProgress50,
      tintColor: Color.Yellow,
    };
  } else if (loadAverage > 25) {
    return {
      source: Icon.CircleProgress25,
      tintColor: Color.Green,
    };
  }

  return {
    source: Icon.Circle,
    tintColor: Color.Green,
  };
};
