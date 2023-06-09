import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CustomRepository } from "../database/typeorm-ex.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/user.entity";

@CustomRepository(Task)
export class TasksRespository extends Repository<Task>{
    private logger = new Logger('Task Repository');

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');
        query.where({ user });

        if(status){
            query.andWhere('task.status = :status', { status });
        }

        if(search){
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%`});
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user ${user.username}. Filter: ${JSON.stringify(filterDto)}`)
            throw new InternalServerErrorException();         
        }

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user,
        });

        await this.save(task);

        return task;
    }

    async deleteTask(id: string, user: User) : Promise<void> {
        const result = await this.delete({id, user});
        if(result.affected === 0){
            throw new NotFoundException(`Task ${id} does not exist`)
        }
    }

}


