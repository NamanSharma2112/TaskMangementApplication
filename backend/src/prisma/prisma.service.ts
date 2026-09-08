import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        // Falls back to the bundled SQLite file so `npm run start` works
        // even before `.env` has been copied from `.env.example`.
        db: { url: process.env.DATABASE_URL || 'file:./prisma/dev.db' },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
