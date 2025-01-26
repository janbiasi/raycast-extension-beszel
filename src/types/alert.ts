export interface Alert {
  id: string;
  user: string;
  system: string;
  /**
   * @example Status, CPU, Memory, Disk, Temperature, Bandwidth
   */
  name: "Status" | "CPU" | "Memory" | "Disk" | "Temperature" | "Bandwidth" | string;
  value?: number;
  min?: number;
  triggered: boolean;
  updated: string;
  created: string;
}
