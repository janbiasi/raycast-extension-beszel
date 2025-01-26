import { Color, Icon, List } from "@raycast/api";

import type { Alert } from "../types/alert";

const mapAlertTargetToIcon: Record<Alert["name"], string> = {
  Status: Icon.Power,
  CPU: Icon.ComputerChip,
  Memory: Icon.MemoryChip,
  Disk: Icon.HardDrive,
  Temperature: Icon.Temperature,
  Bandwidth: Icon.Network,
};

/**
 * Retrieve alerting icon (warning or simple dot) based on alert trigger status
 * @param isTriggered
 * @returns ImageLike
 */
export const getAlertIndicatorIcon = (target: string, isTriggered = false) => {
  const icon = mapAlertTargetToIcon[target] || Icon.Dot;

  if (isTriggered) {
    return { source: icon, tintColor: Color.Red };
  }

  return { source: icon, tintColor: Color.Green };
};

export function AlertListItem({ alert, keywords }: { alert: Alert; keywords?: string[] }) {
  return (
    <List.Item
      id={alert.id}
      title={alert.name}
      keywords={keywords}
      subtitle={alert.min ? `above ${alert.value}% within ${alert.min} minutes` : "all changes"}
      accessories={alert.triggered ? [{ date: new Date(alert.updated) }] : []}
      icon={getAlertIndicatorIcon(alert.name, alert.triggered)}
    />
  );
}
