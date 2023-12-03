import { Migration } from '@mikro-orm/migrations';

export class Migration20231011221933 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "Orders" ("id" serial primary key, "name" varchar(255) not null);',
    );
  }
}
