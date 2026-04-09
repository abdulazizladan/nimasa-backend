import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { ReportModule } from './report/report.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformanceModule } from './performance/performance.module';
import { DeliverablesModule } from './deliverables/deliverables.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false
        }
      }),
    }),
    UserModule,
    AuthModule,
    OrganizationModule,
    ProjectsModule,
    ReportModule,
    PerformanceModule,
    DeliverablesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
