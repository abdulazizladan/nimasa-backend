import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { ReportModule } from './report/report.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: __dirname + '/../db.sqlite', // Use absolute path to database file
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'], // A glob pattern to load your entities
      synchronize: true, // Auto-create database schema. Use with caution in production!
      //logging: ['query', 'error', 'warn'], // Enable detailed SQL query logging
      //logger: 'advanced-console' // Use advanced console logger
    }),
    UserModule,
    AuthModule,
    OrganizationModule,
    ProjectsModule,
    ReportModule,
    PerformanceModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
