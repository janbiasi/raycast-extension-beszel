import { List } from "@raycast/api";

export function ListMetadataSectionHeader({
  hasSpaceBefore = true,
  ...props
}: List.Item.Detail.Metadata.Label.Props & { hasSpaceBefore?: boolean }) {
  return (
    <>
      {hasSpaceBefore && <List.Item.Detail.Metadata.Label title="" />}
      <List.Item.Detail.Metadata.Label {...props} />
      <List.Item.Detail.Metadata.Separator />
    </>
  );
}
