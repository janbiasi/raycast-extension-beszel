export interface System {
  host: string;
  id: string;
  name: string;
  port: string;
  status: string;
  updated: string /* date */;
  info: {
    h: string;
    k: string;
    c: number;
    t: number;
    m: string;
    u: number;
    cpu: number;
    mp: number;
    dp: number;
    b: number;
    v: string;
  };
}
