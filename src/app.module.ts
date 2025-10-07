import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: __dirname + '/../db.sqlite', // Use absolute path to database file
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'], // A glob pattern to load your entities
      synchronize: true, // Auto-create database schema. Use with caution in production!
      logging: ['query', 'error', 'warn'], // Enable detailed SQL query logging
      logger: 'advanced-console' // Use advanced console logger
    }),
  ]
})
export class AppModule {}
