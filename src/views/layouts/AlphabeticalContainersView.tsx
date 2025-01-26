import type { FC } from "react";

import type { ContainerStat } from "../../types/container-stat";
import { guessContainerInfo } from "../../utils/icons";

import { ContainerListItem } from "../../components/ContainerListItem";
import type { System } from "../../types/system";

export const AlphabeticalContainersView: FC<{ containers: ContainerStat[]; system: System }> = ({
  containers,
  system,
}) => {
  const containerIds = containers
    .map((entry) => entry.stats.map((containerStat) => containerStat.n))
    .flat()
    .filter((v, i, a) => a.indexOf(v) === i)
    .toSorted();

  return (
    <>
      {containerIds.sort().map((id) => {
        const info = guessContainerInfo(id);
        return <ContainerListItem key={id} id={id} info={info} system={system} />;
      })}
    </>
  );
};
