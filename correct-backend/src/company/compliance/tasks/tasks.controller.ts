import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('compliance')
@Controller('compliance/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createTaskDto: any,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Post('bulk')
  async createBulk(@Body() createTaskDtos: CreateTaskDto[]) {
    try {
      const tasks = await this.tasksService.createBulkTasks(createTaskDtos);
      return tasks;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.tasksService.findAll();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('company/:companyUuid')
  async findByCompany(@Param('companyUuid') companyUuid: string) {
    try {
      return await this.tasksService.findByCompanyUuid(companyUuid);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('checklist/:checklistUuid')
  async findByChecklist(@Param('checklistUuid') checklistUuid: string) {
    try {
      return await this.tasksService.findTasksByChecklistUuid(checklistUuid);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('user/:userToken')
  async findByAssignedUser(@Param('userToken') userToken: string) {
    try {
      return await this.tasksService.findTasksByAssignedUserToken(userToken);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    try {
      return await this.tasksService.findOneByUuid(uuid);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Patch(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      return await this.tasksService.updateByUuid(uuid, updateTaskDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    try {
      await this.tasksService.removeByUuid(uuid);
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
