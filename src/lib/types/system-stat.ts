export interface SystemStat {
  type: string;
  updated: string;
  created: string;
  stats: {
    cpu: number;
    m: number;
    mu: number;
    mp: number;
    mb: number;
    d: number;
    du: number;
    dp: number;
    dr: number;
    dw: number;
    ns: number;
    nr: number;
  };
}
