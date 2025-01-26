import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import type { FC } from "react";
import { truncateText } from "../utils/truncate";
import type { ContainerInfoGuess } from "../utils/icons";
import { ContainerStatsView } from "../views/ContainerStatsView";
import type { System } from "../types/system";
import { usePreferences } from "../hooks/use-preferences";

export const ContainerListItem: FC<{ id: string; info: ContainerInfoGuess; system: System }> = ({
  id,
  system,
  info,
}) => {
  const preferences = usePreferences();

  return (
    <List.Item
      id={id}
      title={truncateText(id, 30)}
      subtitle={info.label}
      accessories={[
        info.keywords.length > 0 ? { tag: { value: info.keywords[0], color: info.color } } : undefined,
      ].filter((entry) => !!entry)}
      icon={{ source: info.icon, tintColor: Color.SecondaryText }}
      keywords={[id, ...info.keywords]}
      actions={
        <ActionPanel>
          <Action.Push
            title="Show Stats"
            icon={Icon.LineChart}
            target={<ContainerStatsView containerId={id} system={system} />}
          />
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`${preferences.host}/system/${encodeURIComponent(system.name)}`}
          />
        </ActionPanel>
      }
    />
  );
};
