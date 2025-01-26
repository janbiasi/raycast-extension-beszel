import { Color, Icon, type Image } from "@raycast/api";

/**
 * Retrieve the up/down status indicator icon based on the beszel status string
 * @param status
 * @returns ImageLike
 */
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

/**
 * Retrieve a circle progress icon based on a load average (0 - 100)
 * @param loadAverage
 * @returns ImageLike
 */
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

enum ContainerColorType {
  DATABASE = Color.Red,
  NETWORK = Color.Blue,
  PLATFORM = Color.Purple,
  DEFAULT = Color.SecondaryText,
}

export interface ContainerInfoGuess {
  icon: string;
  label?: string;
  color: string;
  cluster: string;
  keywords: string[];
}

/**
 * Icon guesser based on container ids
 * @param containerId
 */
export const guessContainerInfo = (containerId: string): ContainerInfoGuess => {
  if (containerId.startsWith("beszel")) {
    return {
      icon: Icon.Eye,
      label: "Beszel",
      color: ContainerColorType.PLATFORM,
      cluster: "Monitoring",
      keywords: ["monitoring"],
    };
  }

  if (containerId.includes("-log")) {
    return {
      icon: Icon.Paragraph,
      label: "Logging",
      color: ContainerColorType.PLATFORM,
      cluster: "Monitoring",
      keywords: ["infrastructure"],
    };
  }

  if (containerId.includes("proxy")) {
    return {
      icon: Icon.Network,
      label: "Proxy",
      color: ContainerColorType.NETWORK,
      cluster: "Networking",
      keywords: ["networking", "infrastructure"],
    };
  }

  // Databases

  if (containerId.includes("postgres")) {
    return {
      icon: Icon.HardDrive,
      label: "Postgres",
      color: ContainerColorType.DATABASE,
      cluster: "Databases",
      keywords: ["database", "sql", "infrastructure"],
    };
  }

  if (containerId.includes("mysql")) {
    return {
      icon: Icon.HardDrive,
      label: "MySQL",
      color: ContainerColorType.DATABASE,
      cluster: "Databases",
      keywords: ["database", "sql", "infrastructure"],
    };
  }

  if (containerId.includes("mssql")) {
    return {
      icon: Icon.HardDrive,
      label: "Microsoft SQL Server",
      color: ContainerColorType.DATABASE,
      cluster: "Databases",
      keywords: ["database", "sql", "infrastructure"],
    };
  }

  if (containerId.includes("redis")) {
    return {
      icon: Icon.HardDrive,
      label: "Redis",
      color: ContainerColorType.DATABASE,
      cluster: "Databases",
      keywords: ["database", "infrastructure"],
    };
  }

  // Platforms

  if (containerId.startsWith("coolify")) {
    return {
      icon: Icon.Cog,
      label: "Coolify",
      color: ContainerColorType.PLATFORM,
      cluster: "Platforms",
      keywords: ["platform"],
    };
  }
  if (containerId.includes("n8n")) {
    return {
      icon: Icon.Cog,
      label: "N8N",
      color: ContainerColorType.PLATFORM,
      cluster: "Platforms",
      keywords: ["automation", "platform"],
    };
  }

  // Browsers

  if (containerId.includes("chrome") || containerId.includes("puppeteer")) {
    return {
      icon: Icon.Window,
      label: "Browser",
      color: ContainerColorType.DEFAULT,
      cluster: "Browsers",
      keywords: ["browser"],
    };
  }

  // CMS Systems

  if (containerId.includes("payload")) {
    return {
      icon: Icon.Pencil,
      label: "Payload CMS",
      color: ContainerColorType.DEFAULT,
      cluster: "Content Management Systems",
      keywords: ["cms", "payload"],
    };
  }

  if (containerId.includes("strapi")) {
    return {
      icon: Icon.Pencil,
      label: "Strapi",
      color: ContainerColorType.DEFAULT,
      cluster: "Content Management Systems",
      keywords: ["cms", "strapi"],
    };
  }

  if (containerId.includes("pocketbase")) {
    return {
      icon: Icon.Pencil,
      label: "Pocketbase",
      color: ContainerColorType.DEFAULT,
      cluster: "Content Management Systems",
      keywords: ["cms", "pocketbase"],
    };
  }

  // Password managers
  if (containerId.includes("vaultwarden") || containerId.includes("bitwarden")) {
    return {
      icon: Icon.Key,
      label: "Bitwarden",
      color: ContainerColorType.DEFAULT,
      cluster: "Password Managers",
      keywords: ["password-manager", "vaultwarden", "bitwarden"],
    };
  }

  // Generic database guess
  if (containerId.includes("-db")) {
    return {
      icon: Icon.HardDrive,
      label: "Database",
      color: ContainerColorType.DATABASE,
      cluster: "Databases",
      keywords: ["database", "infrastructure"],
    };
  }

  return {
    icon: Icon.Box,
    color: ContainerColorType.DEFAULT,
    cluster: "Others",
    keywords: [],
  };
};
