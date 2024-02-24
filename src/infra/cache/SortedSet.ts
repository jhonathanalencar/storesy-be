export interface SortedSet {
  increment(setKey: string, value: number, setMember: string): Promise<any>;
  getSortedSet(setKey: string, start: number, stop: number): Promise<any>;
  getMemberScore(setKey: string, setMember: string): Promise<any>;
}
