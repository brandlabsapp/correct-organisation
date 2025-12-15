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
// import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('company/:companyId')
  async findByCompany(@Param('companyId') companyId: string) {
    try {
      return await this.tasksService.findByCompany(+companyId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('checklist/:checklistId')
  async findByChecklist(@Param('checklistId') checklistId: string) {
    try {
      return await this.tasksService.findTasksByChecklist(+checklistId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('user/:userId')
  async findByAssignedUser(@Param('userId') userId: string) {
    try {
      return await this.tasksService.findTasksByAssignedUser(+userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.tasksService.findOne(+id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      return await this.tasksService.update(+id, updateTaskDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.tasksService.remove(+id);
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
