import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from '@libs/providers/providers.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ErrorsModule } from '@libs/errors/errors.module';
import { UserModule } from './user/user.module';
import { RecordModule } from './record/record.module';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guard';

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
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
