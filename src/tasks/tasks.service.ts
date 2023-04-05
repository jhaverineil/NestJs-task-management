import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRespository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRespository)
        private tasksRepository: TasksRespository,
    ) { }

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({
            where: {
                id,
                user,
            }
        });
        if (!found) {
            throw new NotFoundException(`Task ${id} not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: string, user: User): Promise<void> {
        return this.tasksRepository.deleteTask(id,user);
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        if (!task) {
            throw new NotFoundException(`Task ${id} does not exist`);
        }

        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

}


