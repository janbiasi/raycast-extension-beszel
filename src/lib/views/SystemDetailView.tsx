import { Icon, List } from "@raycast/api";
import type { FC } from "react";

import { useListCollection } from "../hooks/use-pocketbase";
import { SystemStat } from "../types/system-stat";
import { useFormat } from "../hooks/use-format";
import type { System } from "../types/system";

export const SystemDetailView: FC<{ system: System; id: string }> = ({ system, id }) => {
  const { dateTimeFormat } = useFormat();
  const { data, isLoading, pagination } = useListCollection<SystemStat>("system_stats", {
    filter: `(system='${id}')`,
  });

  return (
    <List isShowingDetail isLoading={isLoading} navigationTitle={system.name} pagination={pagination}>
      {data
        .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
        .reverse()
        .map((stat) => (
          <List.Item
            title={dateTimeFormat.format(new Date(stat.updated))}
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Server" text={system.info.m} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="System" />
                    <List.Item.Detail.Metadata.Label title="Host" text={system.host} />
                    <List.Item.Detail.Metadata.Label title="Port" text={system.port} />
                    <List.Item.Detail.Metadata.Label title="Status" text={system.status} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label
                      icon={Icon.Layers}
                      title="Docker CPU Usage"
                      text={`${stat.stats.dp}%`}
                    />
                    <List.Item.Detail.Metadata.Label
                      icon={Icon.MemoryChip}
                      title="CPU Usage"
                      text={`${stat.stats.cpu}%`}
                    />
                    <List.Item.Detail.Metadata.Label
                      icon={Icon.MemoryChip}
                      title="Memory Usage"
                      text={`${stat.stats.mp}%`}
                    />
                    <List.Item.Detail.Metadata.Label
                      icon={Icon.HardDrive}
                      title="Disk Usage"
                      text={`${stat.stats.dp}%`}
                    />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label icon={Icon.Network} title="Sent" text={`${stat.stats.ns}MBs`} />
                    <List.Item.Detail.Metadata.Label
                      icon={Icon.Network}
                      title="Received"
                      text={`${stat.stats.nr}MBs`}
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
