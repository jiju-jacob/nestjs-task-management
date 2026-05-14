import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getAll(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getById(id: string, user: User): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto, user: User): Promise<TaskEntity> {
    return this.tasksRepository.createTask(dto, user);
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    user: User,
  ): Promise<TaskEntity> {
    const task = await this.getById(id, user);
    if (dto.title !== undefined) {
      task.title = dto.title;
    }
    if (dto.description !== undefined) {
      task.description = dto.description;
    }
    if (dto.status !== undefined) {
      task.status = dto.status;
    }
    await this.tasksRepository.save(task);
    return task;
  }

  async remove(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }
}
