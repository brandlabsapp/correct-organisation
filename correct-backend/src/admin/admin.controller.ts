import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto, LoginAdminDto } from './dto/create-admin.dto';
import { CreateChecklistDto } from './dto/checklist.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get(':id')
  async getAdminById(@Param('id') id: string) {
    try {
      const admin = await this.adminService.getAdminById(+id);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() admin: LoginAdminDto) {
    try {
      const response = await this.adminService.login(admin);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('create-admin')
  async createAdmin(@Body() admin: CreateAdminDto) {
    const response = await this.adminService.createAdmin(admin);
    return response;
  }

  @Get('company/:id')
  async findCompanyById(@Param('id') id: string) {
    try {
      const company = await this.adminService.findCompanyById(+id);
      return company;
    } catch (error) {
      throw error;
    }
  }

  @Post('create-checklists')
  async createChecklist(@Body() checklist: CreateChecklistDto) {
    try {
      console.log(checklist, 'checklist');
      const response = await this.adminService.createBulkChecklist(checklist);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Patch('company/members/:id')
  async updateCompanyMember(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    try {
      const companyMember = await this.adminService.updateCompanyMember(
        +id,
        updateAdminDto,
      );
      return companyMember;
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete('delete-checklist/:id')
  deleteChecklistById(@Param('id') id: string) {
    try {
      const response = this.adminService.deleteChecklistById(+id);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
