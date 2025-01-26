import { List } from "@raycast/api";
import { useCallback, useState, type FC } from "react";

import { useListCollection } from "../hooks/use-list-collection";
import type { System } from "../types/system";
import type { ContainerStat } from "../types/container-stat";
import { ClusteredContainersView } from "./layouts/ClusteredContainersView";
import { AlphabeticalContainersView } from "./layouts/AlphabeticalContainersView";

export const ContainersView: FC<{ system: System }> = ({ system }) => {
  const [viewMode, setViewMode] = useState<string | null>("clustered");

  const { data, isLoading } = useListCollection<ContainerStat>("container_stats", {
    filter: `system='${system.id}'&&type='480m'`,
    sort: "-created",
    perPage: 200, // TODO: one entry already contains all containers, revalidate this
  });

  const handleViewModeChange = useCallback(
    (id: string) => {
      setViewMode(id);
    },
    [viewMode],
  );

  const containerIds = data
    .map((entry) => entry.stats.map((containerStat) => containerStat.n))
    .flat()
    .filter((v, i, a) => a.indexOf(v) === i)
    .toSorted();

  return (
    <List
      key={`${viewMode}`}
      isLoading={isLoading}
      navigationTitle={`Beszel - ${system.name} - Containers`}
      searchBarPlaceholder={`Search ${containerIds.length} containers`}
      searchBarAccessory={
        <List.Dropdown
          value={viewMode || "clustered"}
          onChange={handleViewModeChange}
          tooltip="Select view mode"
          defaultValue="clustered"
        >
          <List.Dropdown.Item title="Clustered" value="clustered" />
          <List.Dropdown.Item title="Alphabetical" value="alphabetical" />
        </List.Dropdown>
      }
    >
      {viewMode === "clustered" && <ClusteredContainersView system={system} containers={data} />}
      {viewMode === "alphabetical" && <AlphabeticalContainersView system={system} containers={data} />}
    </List>
  );
};

/* {data.map((stat) => (
        <List.Item
          key={stat.type + stat.created}
          accessories={[{ date: new Date(stat.created) }]}
          title={dateTimeFormat.format(new Date(stat.updated))}
          //   subtitle={`${getAverageLoadPercentage(stat).toFixed(0)}%`}
          //   icon={getSystemLoadIndicatorIcon(getAverageLoadPercentage(stat))}
          detail={
            <List.Item.Detail
              key={`${interval}-${stat.type}-${stat.created}`}
              //   metadata={
              //     <List.Item.Detail.Metadata>
              //       <ListMetadataSectionHeader hasSpaceBefore={false} title="Usage" icon={Icon.MemoryChip} />
              //       <List.Item.Detail.Metadata.Label title="Docker CPU Usage" text={`${stat.stats.dp.toFixed(2)}%`} />
              //       <List.Item.Detail.Metadata.Label title="CPU Usage" text={`${stat.stats.cpu.toFixed(2)}%`} />
              //       <List.Item.Detail.Metadata.Label title="Memory Usage" text={`${stat.stats.mp.toFixed(2)}%`} />
              //       <ListMetadataSectionHeader title="Disk I/O" icon={Icon.HardDrive} />
              //       <List.Item.Detail.Metadata.Label title="Usage" text={`${stat.stats.dp.toFixed(2)}%`} />
              //       <List.Item.Detail.Metadata.Label title="Read" text={`${stat.stats.dr.toFixed(2)} MB/s`} />
              //       <List.Item.Detail.Metadata.Label title="Write" text={`${stat.stats.dw.toFixed(2)} MB/s`} />
              //       <ListMetadataSectionHeader title="Bandwidth" icon={Icon.Network} />
              //       <List.Item.Detail.Metadata.Label title="Sent" text={`${stat.stats.ns.toFixed(2)} MBs`} />
              //       <List.Item.Detail.Metadata.Label title="Received" text={`${stat.stats.nr.toFixed(2)} MBs`} />
              //     </List.Item.Detail.Metadata>
              //   }
            />
          }
        />
      ))} */
