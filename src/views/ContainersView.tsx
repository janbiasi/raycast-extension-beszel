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
