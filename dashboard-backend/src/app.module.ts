import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from '@libs/providers/providers.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ErrorsModule } from '@libs/errors/errors.module';
import { UserModule } from './user/user.module';
import { RecordController } from './record/record.controller';
import { RecordModule } from './record/record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    ProvidersModule,
    ErrorsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    UserModule,
    RecordModule,
  ],
  controllers: [RecordController],
  providers: [],
})
export class AppModule {}
