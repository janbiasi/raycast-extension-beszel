import { Icon, List } from "@raycast/api";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";

import { useListCollection } from "../hooks/use-list-collection";
import { SystemStat } from "../types/system-stat";
import { useFormat } from "../hooks/use-format";
import type { System } from "../types/system";
import { getSystemLoadIndicatorIcon } from "../utils/icons";
import { ListMetadataSectionHeader } from "../components/ListMetadataSectionHeader";
import { renderStatValue } from "../utils/stats";

/**
 * Calculate load average of the system (current: memory, cpu and docker)
 * @param stat
 * @returns 0 - 100
 */
const getAverageLoadPercentage = (stat: SystemStat) => {
  const respectedStats = [stat.stats?.cpu, stat.stats?.mp, stat.stats?.dp].filter(Boolean);
  return respectedStats.reduce((a, b) => a + b) / respectedStats.length;
};

export const StatsDetailView: FC<{ system: System; id: string }> = ({ system, id }) => {
  const { dateTimeFormat } = useFormat();
  const [interval, setInterval] = useState<string | null>("120m");

  const { data, isLoading, revalidate, pagination } = useListCollection<SystemStat>("system_stats", {
    filter: `system='${id}'&&type='${interval}'`,
    sort: "-created",
  });

  const sortedData = useMemo(
    () => data.toSorted((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()).toReversed(),
    [data],
  );

  const handleIntervalChange = useCallback(
    (id: string) => {
      setInterval(id);
      revalidate();
    },
    [interval],
  );

  useEffect(() => {
    revalidate();
  }, [interval]);

  return (
    <List
      key={`${interval}`}
      isLoading={isLoading}
      isShowingDetail
      pagination={pagination}
      navigationTitle={`Beszel - ${system.name}`}
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
      {sortedData.map((stat) => (
        <List.Item
          key={stat.type + stat.created}
          accessories={[{ date: new Date(stat.created) }]}
          title={dateTimeFormat.format(new Date(stat.updated))}
          subtitle={`${renderStatValue(getAverageLoadPercentage(stat), "%", 0)}`}
          icon={getSystemLoadIndicatorIcon(getAverageLoadPercentage(stat))}
          detail={
            <List.Item.Detail
              key={`${interval}-${stat.type}-${stat.created}`}
              metadata={
                <List.Item.Detail.Metadata>
                  <ListMetadataSectionHeader hasSpaceBefore={false} title="Usage" icon={Icon.MemoryChip} />
                  <List.Item.Detail.Metadata.Label
                    title="Docker CPU Usage"
                    text={`${renderStatValue(stat.stats.dp, "%")}`}
                  />
                  <List.Item.Detail.Metadata.Label title="CPU Usage" text={`${renderStatValue(stat.stats.cpu, "%")}`} />
                  <List.Item.Detail.Metadata.Label
                    title="Memory Usage"
                    text={`${renderStatValue(stat.stats.mp, "%")}`}
                  />
                  <ListMetadataSectionHeader title="Disk I/O" icon={Icon.HardDrive} />
                  <List.Item.Detail.Metadata.Label title="Usage" text={`${renderStatValue(stat.stats.dp, "%")}`} />
                  <List.Item.Detail.Metadata.Label title="Read" text={`${renderStatValue(stat.stats.dr, "MB/s")}`} />
                  <List.Item.Detail.Metadata.Label title="Write" text={`${renderStatValue(stat.stats.dw, "MB/s")}`} />
                  <ListMetadataSectionHeader title="Bandwidth" icon={Icon.Network} />
                  <List.Item.Detail.Metadata.Label title="Sent" text={`${renderStatValue(stat.stats.ns, "MB/s")}`} />
                  <List.Item.Detail.Metadata.Label
                    title="Received"
                    text={`${renderStatValue(stat.stats.nr, "MB/s")}`}
                  />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      ))}
    </List>
  );
};
