import { CompanyMembersService } from './company-members/company-members.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyMembersDto } from './dto/company-member.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyMemberServices: CompanyMembersService,
  ) {}

  @Post('register')
  create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const response = this.companyService.create(createCompanyDto);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Post('verify-role')
  async verifyRole(@Body() dto: any) {
    try {
      const result = await this.companyService.verifyRole(dto);
      return { success: true, data: result };
    } catch (err) {
      console.log('err...', err);
      throw new BadRequestException(err.message || 'Role verification failed');
    }
  }

  @Post('invite-member')
  inviteMember(@Body() createCompanyMemberDto: CreateCompanyMembersDto) {
    try {
      const response = this.companyService.inviteMember(createCompanyMemberDto);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Post('activate-member')
  activateMember(@Body() token: string) {
    try {
      console.log('token', token);
      const response = this.companyService.activateMember(token);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  @Get('all-companies')
  async findAll() {
    try {
      const response = await this.companyService.findAll();
      if (!response) {
        throw new NotFoundException('No company found');
      }
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.companyService.findOne(+id);
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      console.log('updateCompanyDto', updateCompanyDto);
      const response = await this.companyService.update(+id, updateCompanyDto);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
