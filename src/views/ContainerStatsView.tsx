import { Icon, List } from "@raycast/api";
import { useCallback, useState, type FC } from "react";

import { useListCollection } from "../hooks/use-list-collection";
import type { System } from "../types/system";
import type { ContainerStat, ContainerStatStats } from "../types/container-stat";
import { getSystemLoadIndicatorIcon } from "../utils/icons";
import { useFormat } from "../hooks/use-format";
import { ListMetadataSectionHeader } from "../components/ListMetadataSectionHeader";
import { renderStatValue } from "../utils/stats";

/**
 * Calculate load average of a single container (current: memory and cpu)
 * @param stat
 * @returns 0 - 100
 */
const getAverageLoadPercentage = (stat?: ContainerStatStats) => {
  if (!stat) {
    return 0;
  }

  const respectedStats = [stat.c].filter(Boolean);
  return respectedStats.reduce((a, b) => a + b) / respectedStats.length;
};

export const ContainerStatsView: FC<{ system: System; containerId: string }> = ({ system, containerId }) => {
  const { dateTimeFormat } = useFormat();
  const [interval, setInterval] = useState<string | null>("120m");

  const { data, isLoading, pagination, revalidate } = useListCollection<ContainerStat>("container_stats", {
    filter: `system='${system.id}'&&type='${interval}'`,
    sort: "-created",
  });

  const handleIntervalChange = useCallback(
    (id: string) => {
      setInterval(id);
      revalidate();
    },
    [interval],
  );

  return (
    <List
      isShowingDetail
      key={`${interval}`}
      isLoading={isLoading}
      pagination={pagination}
      navigationTitle={`Beszel - ${system.name} - Container - ${containerId} `}
      searchBarAccessory={
        <List.Dropdown
          value={interval || "480m"}
          onChange={handleIntervalChange}
          tooltip="Select interval"
          defaultValue="480m"
        >
          <List.Dropdown.Item title="1 Minute" value="1m" />
          <List.Dropdown.Item title="10 Minutes" value="10m" />
          <List.Dropdown.Item title="20 Minutes" value="20m" />
          <List.Dropdown.Item title="2 Hours" value="120m" />
          <List.Dropdown.Item title="8 Hours" value="480m" />
        </List.Dropdown>
      }
    >
      {data.map((entry) => {
        const stat = entry.stats.find((entry) => entry.n === containerId)!;
        return (
          <List.Item
            key={entry.type + entry.created + containerId}
            accessories={[{ date: new Date(entry.created) }]}
            title={dateTimeFormat.format(new Date(entry.updated))}
            subtitle={`${renderStatValue(getAverageLoadPercentage(stat), "%", 0)}`}
            icon={getSystemLoadIndicatorIcon(getAverageLoadPercentage(stat))}
            detail={
              <List.Item.Detail
                key={`${interval}-${entry.type}-${entry.created}`}
                metadata={
                  <List.Item.Detail.Metadata>
                    <ListMetadataSectionHeader hasSpaceBefore={false} title="Usage" icon={Icon.MemoryChip} />
                    <List.Item.Detail.Metadata.Label title="CPU Usage" text={`${renderStatValue(stat?.c, "%")}`} />
                    <List.Item.Detail.Metadata.Label
                      title="Memory Usage"
                      text={`${renderStatValue(stat?.m, "MB/s")}`}
                    />
                    <ListMetadataSectionHeader title="Bandwidth" icon={Icon.Network} />
                    <List.Item.Detail.Metadata.Label title="Sent" text={`${renderStatValue(stat?.ns, "MB/s")}`} />
                    <List.Item.Detail.Metadata.Label title="Received" text={`${renderStatValue(stat?.nr, "MB/s")}`} />
                  </List.Item.Detail.Metadata>
                }
              />
            }
          />
        );
      })}
    </List>
  );
};
