import { usePreferences } from "./use-preferences";
import { showFailureToast, useFetch } from "@raycast/utils";
import type { ListResult } from "pocketbase";

export interface UseListCollectionOptions {
  /**
   * How many items per page
   */
  perPage?: number;
  /**
   * @see https://pocketbase.io/docs/api-records/#listsearch-records
   * @example id='abc123'
   */
  filter?: string;
  /**
   * @see https://pocketbase.io/docs/api-records/#listsearch-records
   * @example -created
   */
  sort?: string;
}

export function useListCollection<T>(collection: string, options: UseListCollectionOptions = {}) {
  const preferences = usePreferences();

  const queryParams = new URLSearchParams();
  for (const key in options) {
    queryParams.set(key, String(options[key as keyof typeof options]));
  }

  return useFetch(
    (opts) => {
      const url = new URL(`/api/collections/${collection}/records`, preferences.host);
      queryParams.set("page", String(opts.page + 1)); // increment page as pages start with 1
      const queryString = queryParams.toString().length > 0 ? `?${queryParams.toString()}` : "";
      return `${url}${queryString}` satisfies RequestInfo;
    },
    {
      cache: "no-cache",
      keepPreviousData: true,
      initialData: [],
      mapResult(result: ListResult<T>) {
        return {
          ...result,
          data: result.items,
          hasMore: result.page < result.totalPages,
        };
      },
      headers: {
        Authorization: `Bearer ${preferences.token}`,
      },
      async onError(error) {
        showFailureToast(error, {
          title: `Failed to list records from ${collection}`,
          message: error.message,
        });
      },
    },
  );
}
