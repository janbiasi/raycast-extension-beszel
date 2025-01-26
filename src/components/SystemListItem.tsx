import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { usePreferences } from "../hooks/use-preferences";
import type { System } from "../types/system";
import type { Alert } from "../types/alert";
import { StatsDetailView } from "../views/SystemStatsView";
import { ContainersView } from "../views/ContainersView";
import { ListMetadataSectionHeader } from "./ListMetadataSectionHeader";
import { useListCollection } from "../hooks/use-list-collection";

export function SystemListItem({
  system,
  isShowingDetail,
  onToggleDetail,
}: {
  system: System;
  isShowingDetail: boolean;
  onToggleDetail: () => void;
}) {
  const preferences = usePreferences();

  const { data, isLoading } = useListCollection<Alert>("alerts", {
    filter: `system='${system.id}'`,
  });

  return (
    <List.Item
      title={system.name}
      subtitle={isShowingDetail ? "" : system.info.m}
      icon={{
        source: Icon.MemoryChip,
        tintColor: system.status === "up" ? Color.Green : Color.Red,
      }}
      accessories={
        isShowingDetail
          ? []
          : [{ icon: Icon.Plug, text: `${system.host}:${system.port}` }, { date: new Date(system.updated) }]
      }
      detail={
        <List.Item.Detail
          isLoading={isLoading}
          metadata={
            <List.Item.Detail.Metadata>
              <ListMetadataSectionHeader hasSpaceBefore={false} title="Information" icon={Icon.Info} />
              <List.Item.Detail.Metadata.Label title="Server" text={system.info.m} />
              <List.Item.Detail.Metadata.Label title="Kernel" text={system.info.k} />
              <List.Item.Detail.Metadata.Label title="Status" text={system.status} />
              <List.Item.Detail.Metadata.Label title="CPU" text={`${system.info.c}C / ${system.info.t}T`} />
              <ListMetadataSectionHeader title="Configured Alerts" icon={Icon.Bell} />
              {data
                .filter((alertInfo) => alertInfo.value > 0)
                .map((alertInfo) => (
                  <List.Item.Detail.Metadata.Label
                    key={alertInfo.id}
                    title={alertInfo.name}
                    text={`> ${alertInfo.value}% within ${alertInfo.min}min`}
                  />
                ))}
              <ListMetadataSectionHeader title="Agent" icon={Icon.Network} />
              <List.Item.Detail.Metadata.Label title="Version" text={system.info.v} />
              <List.Item.Detail.Metadata.Label title="Hostname" text={system.info.h} />
              <List.Item.Detail.Metadata.Label title="Connection" text={`${system.host}:${system.port}`} />
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <ActionPanel>
          <Action
            title={isShowingDetail ? "Hide Details" : "Show Details"}
            icon={isShowingDetail ? Icon.EyeDisabled : Icon.Eye}
            onAction={onToggleDetail}
          />
          <Action.Push
            title="Show System Stats"
            icon={Icon.LineChart}
            target={<StatsDetailView system={system} id={system.id} />}
          />
          <Action.Push
            title="Show Containers"
            shortcut={{
              key: "c",
              modifiers: [],
            }}
            icon={Icon.Box}
            target={<ContainersView system={system} />}
          />
          <Action.OpenInBrowser
            title="View in Browser"
            shortcut={{
              key: "b",
              modifiers: [],
            }}
            url={`${preferences.host}/system/${encodeURIComponent(system.name)}`}
          />
        </ActionPanel>
      }
    />
  );
}
