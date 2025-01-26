import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { usePreferences } from "../hooks/use-preferences";
import type { System } from "../types/system";
import { StatsDetailView } from "../views/StatsDetailView";
import { SystemDetailView } from "../views/SystemDetailView";

export function SystemListItem({ system }: { system: System }) {
  const preferences = usePreferences();
  return (
    <List.Item
      key={system.id}
      icon={{
        source: Icon.MemoryChip,
        tintColor: system.status === "up" ? Color.Green : Color.Red,
      }}
      title={system.name}
      subtitle={system.info.m}
      accessories={[
        { icon: Icon.Network, text: system.host },
        { icon: Icon.Plug, text: system.port },
        { date: new Date(system.updated) },
      ]}
      detail={
        <List.Item.Detail
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Link target="https://asdf" text="Link" title="Title" />
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <ActionPanel>
          <Action.Push
            title="Show Stats"
            icon={Icon.LineChart}
            target={<StatsDetailView system={system} id={system.id} />}
          />
          <Action.OpenInBrowser
            title="View in Beszel"
            url={`${preferences.host}/system/${encodeURIComponent(system.name)}`}
          />
          <Action.Push
            title="Show Details"
            icon={Icon.Info}
            target={<SystemDetailView system={system} id={system.id} />}
          />
        </ActionPanel>
      }
    />
  );
}
