import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { NotificationService } from '@/notification/notification.service';

@Controller('checklist')
export class ChecklistController {
  constructor(
    private readonly checklistService: ChecklistService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  async create(@Body() createChecklistDto: CreateChecklistDto) {
    try {
      const response =
        await this.checklistService.createChecklist(createChecklistDto);

      if (this.notificationService && response.userId && response.id) {
        // const notification = await this.notificationService.createNotification({
        //   userId: response.userId,
        //   title: 'New Compliance Checklist Created',
        //   type: 'CHECKLIST_CREATION',
        //   message: `A new checklist "${response.title}" has been created`,
        //   objectId: response.id,
        //   isRead: false,
        // });
        // if (notification && this.pushService) {
        //   const token = await this.pushService.getDeviceToken(
        //     notification.userId,
        //   );
        //   if (token && token.token) {
        //     await this.pushService.sendPushNotificationToDeviceToken(
        //       token.token,
        //       {
        //         title: notification.title,
        //         body: notification.message,
        //         data: {
        //           notificationId: notification.id,
        //           type: notification.type,
        //           objectId: notification.objectId?.toString() || '',
        //         },
        //       },
        //     );
        //   }
        // }
      }

      return {
        success: true,
        message: 'Compliance checklist created successfully',
        data: response,
      };
    } catch (error) {
      console.error('Error creating checklist:', error);
      throw error;
    }
  }

  @Get()
  async getAllChecklist() {
    try {
      const response = await this.checklistService.getAllChecklist();
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Get('/company-checklist/:companyId')
  async getCompanyChecklist(
    @Param('companyId') companyId: string,
    @Query('checklistId') checklistId?: string,
  ) {
    try {
      const data = await this.checklistService.getCompanyChecklist(
        +companyId,
        checklistId ? +checklistId : undefined,
      );
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Get('/:id')
  async getChecklistById(@Param('id') id: string) {
    try {
      const data = await this.checklistService.getChecklistById(+id);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Patch('/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    try {
      const checklist = await this.checklistService.updateChecklistStatus(
        +id,
        body.status,
      );
      return {
        success: true,
        message: `Checklist status updated to ${body.status}`,
        data: checklist,
      };
    } catch (error) {
      console.error('Error updating checklist status:', error);
      throw error;
    }
  }
}
