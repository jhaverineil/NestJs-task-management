import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksRespository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TasksRespository]),
    TypeOrmModule.forFeature([Task]),
    AuthModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}