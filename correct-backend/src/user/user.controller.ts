import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiTags, ApiParam, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { Public } from '@/auth/public.decorator';
import { ErrorResponseDto } from '@/core/dto/api-responses.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Public()
  @Get('all')
  async getUsers() {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current logged in user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile' })
  @ApiResponse({ status: 401, type: ErrorResponseDto, description: 'Unauthorized' })
  getLoggedInUser(@Request() req) {
    return req.user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User unique identifier' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, type: ErrorResponseDto, description: 'User not found' })
  async getUser(@Param('id') id: number) {
    try {
      const userFound = await this.userService.findOneById(id);
      if (!userFound) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return userFound;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new NotFoundException(`User not found with ID ${id}`);
    }
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    try {
      const user = req.user;
      console.log('Updating user with ID:', user.id);
      console.log('Update data:', updateUserDto);
      const updatedUser = await this.userService.update(user.id, updateUserDto);
      console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    const response = this.userService.delete(id);
    console.log('Deleted user:', response);
    return response;
  }
}
