import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CompanyMembersService } from './company-members.service';

@Controller('company-members')
export class CompanyMembersController {
  constructor(private readonly companyMemberServices: CompanyMembersService) {}
  @Get('existing/:userId')
  async findAllCompaniesByUser(@Param('userId') userId: string) {
    try {
      const response = await this.companyMemberServices.findAll({
        userId: +userId,
      });
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Get(':companyId')
  async findAllCompanyMembers(@Param('companyId') companyId: string) {
    try {
      const response = await this.companyMemberServices.findAll({
        companyId: +companyId,
      });
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  @Patch('update/:userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateCompanyMembersDto: any,
  ) {
    try {
      const body = updateCompanyMembersDto;

      const response = await this.companyMemberServices.update(
        { userId: +userId, companyId: body.companyId },
        {
          lastAccessedAt: body.lastAccessedAt,
        },
      );
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Delete(':id')
  async removeCompanyMembers(@Param('id') id: string) {
    try {
      const response = await this.companyMemberServices.destroy(+id);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
