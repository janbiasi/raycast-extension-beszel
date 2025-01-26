import { getPreferenceValues } from "@raycast/api";

export interface BeszelPreferences {
  host: string;
  token: string;
  formatterLocale?: string;
}

export function usePreferences(): Required<BeszelPreferences> {
  return {
    formatterLocale: "en",
    ...getPreferenceValues<BeszelPreferences>(),
  };
}
