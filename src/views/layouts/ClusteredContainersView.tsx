import type { FC } from "react";
import { List } from "@raycast/api";

import type { ContainerStat } from "../../types/container-stat";
import { guessContainerInfo, type ContainerInfoGuess } from "../../utils/icons";

import { ContainerListItem } from "../../components/ContainerListItem";
import type { System } from "../../types/system";

export const ClusteredContainersView: FC<{ containers: ContainerStat[]; system: System }> = ({
  containers,
  system,
}) => {
  const containerIds = containers
    .map((entry) => entry.stats.map((containerStat) => containerStat.n))
    .flat()
    .filter((v, i, a) => a.indexOf(v) === i)
    .toSorted();

  const clusteredContainers = containerIds
    .map((id) => ({ id, info: guessContainerInfo(id) }))
    .reduce(
      (prev, item) => ({
        ...prev,
        [item.info.cluster]: [...(prev[item.info.cluster] || []), item],
      }),
      {} as Record<string, Array<{ id: string; info: ContainerInfoGuess }>>,
    );

  return (
    <>
      {Object.keys(clusteredContainers)
        .sort()
        .map((cluster) => (
          <List.Section key={cluster} title={cluster} subtitle={`${clusteredContainers[cluster].length}`}>
            {clusteredContainers[cluster].map(({ id, info }) => (
              <ContainerListItem key={id} id={id} info={info} system={system} />
            ))}
          </List.Section>
        ))}
    </>
  );
};
