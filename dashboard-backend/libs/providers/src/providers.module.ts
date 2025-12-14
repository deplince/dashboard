import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm/typeorm.module';
import { CacheStorageModule } from './cache-storage/cache-storage.module';

@Module({
  imports: [TypeormModule, CacheStorageModule],
  exports: [CacheStorageModule],
})
export class ProvidersModule {}
