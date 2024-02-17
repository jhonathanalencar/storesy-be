export interface SortedSet {
  increment(setKey: string, value: number, setMember: string): Promise<any>;
  getSortedSet(
    setKey: string,
    start: number,
    stop: number,
    limit?: number
  ): Promise<any>;
}
