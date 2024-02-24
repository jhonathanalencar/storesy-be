import { Redis } from 'ioredis';
import { SortedSet } from './SortedSet';

export class RedisAdapter implements SortedSet {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      password: process.env.REDIS_PASSWORD,
    });
  }

  async increment(setKey: string, value: number, setMember: string): Promise<string> {
    const score = await this.redis.zincrby(setKey, value, setMember);
    return score;
  }

  async getSortedSet(setKey: string, start: number, stop: number): Promise<string[]> {
    const sortedSet = await this.redis.zrange(setKey, start, stop, 'REV', 'WITHSCORES');
    return sortedSet;
  }

  async getMemberScore(setKey: string, setMember: string): Promise<string | null> {
    const score = await this.redis.zscore(setKey, setMember);
    return score;
  }
}
