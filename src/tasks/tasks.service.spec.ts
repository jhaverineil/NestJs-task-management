import { Test } from "@nestjs/testing";
import { TasksRespository } from "./tasks.repository";
import { TasksService } from "./tasks.service";

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
})

const mockUser = {
    username: 'Ariel',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
}

describe('TasksService',()=>{
    let tasksService: TasksService;
    let tasksRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TasksRespository, useFactory: mockTasksRepository}
            ],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRespository);
    });

    describe('getTasks',()=>{
        it('calls TasksRepository.getTasks and returns the result', async ()=>{
            expect(tasksRepository.getTasks).not.toHaveBeenCalled();
            tasksRepository.getTasks.mockResolvedValue('someValue')

            const result = await tasksService.getTasks(null,mockUser)
            expect(tasksRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue')
        })
    })
})