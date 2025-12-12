import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './cache-storage.config';

@Module({
  imports: [CacheModule.register(RedisConfig)],
  controllers: [],
})
export class CacheStorageModule {}
