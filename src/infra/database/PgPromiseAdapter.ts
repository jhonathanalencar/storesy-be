import pgp from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';

import { Connection } from './Connection';

export class PgPromiseAdapter implements Connection {
  connection: pgp.IDatabase<{}, pg.IClient> = pgp()(
    process.env.DATABASE_URL as string
  );

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    this.connection.$pool.end();
  }
}
