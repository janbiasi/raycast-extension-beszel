import { Icon, List } from "@raycast/api";

import { useListCollection } from "./lib/hooks/use-pocketbase";
import { System } from "./lib/types/system";

import { useMemo } from "react";
import { SystemListItem } from "./lib/components/SystemListItem";
import { EmptyListItem } from "./lib/components/EmptListItem";

export default function Command() {
  const { data, isLoading, pagination } = useListCollection<System>("systems");

  const downSystems = useMemo(() => data.filter((sys) => sys.status === "down"), [data]);
  const upSystems = useMemo(() => data.filter((sys) => sys.status === "up"), [data]);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search systems" pagination={pagination}>
      <List.Section title="Up" subtitle={`${upSystems.length}`}>
        {upSystems.map((system) => (
          <SystemListItem system={system} />
        ))}
        {upSystems.length === 0 && (
          <EmptyListItem icon={Icon.Alarm} title="No system up and running, that's not great" />
        )}
      </List.Section>
      <List.Section title="Down" subtitle={`${downSystems.length}`}>
        {downSystems.map((system) => (
          <SystemListItem system={system} />
        ))}
        {downSystems.length === 0 && (
          <EmptyListItem icon={Icon.Checkmark} title="No system is down at the moment, that's great!" />
        )}
      </List.Section>
    </List>
  );
}
