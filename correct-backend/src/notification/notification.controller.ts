import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CreateNotificationChangeDto } from './dto/create-notification-change.dto';
import { CreateNotificationObjectDto } from './dto/create-notification-object.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const notification = await this.notificationService.createNotification(
        createNotificationDto,
      );
      return notification;
    } catch (error) {
      throw error;
    }
  }

  @Post('object')
  async createNotificationObject(
    @Body() createNotificationObjectDto: CreateNotificationObjectDto,
  ) {
    try {
      const notificationObject =
        await this.notificationService.createNotificationObject(
          createNotificationObjectDto,
        );
      return notificationObject;
    } catch (error) {
      throw error;
    }
  }

  @Post('change')
  async createNotificationChange(
    @Body() createNotificationChangeDto: CreateNotificationChangeDto,
  ) {
    try {
      const notificationChange =
        await this.notificationService.createNotificationChange(
          createNotificationChangeDto,
        );
      return notificationChange;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
