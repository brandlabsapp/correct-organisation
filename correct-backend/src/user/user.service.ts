import { CompanyDetails } from '@/company/entities/company.entity';
import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  COMPANY_REPOSITORY,
  USER_REPOSITORY,
  COMPANY_MEMBER_REPOSITORY,
} from '@/core/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { Cache } from 'cache-manager';
import { CompanyMember } from '@/company/entities/company-members.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: typeof CompanyDetails,
    @Inject(COMPANY_MEMBER_REPOSITORY)
    private readonly companyMemberRepository: typeof CompanyMember,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    this.logger.log('Creating user:', user);
    try {
      const newUser = await this.userRepository.create<User>(user);
      this.logger.log('User created successfully:', newUser);
      return newUser;
    } catch (err) {
      this.logger.error(err.message, 'UserService', 'create');
      throw err;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { email },
      });
      this.logger.log('User found:', user);
      return user;
    } catch (err) {
      this.logger.error(err.message, 'UserService', 'findOneByEmail');
      throw err;
    }
  }

  async findOneByPhone(phone: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { phone },
        include: {
          model: CompanyDetails,
        },
      });
      this.logger.log('User found:', user);
      return user;
    } catch (err) {
      this.logger.error(err.message, 'UserService', 'findOneByPhone');
      console.error(`Error in findOneByEmail:`, err);
      throw err;
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { id },
        include: [
          {
            model: CompanyDetails,
            required: false,
          },
          {
            model: CompanyMember,
            required: false,
            include: [
              {
                model: CompanyDetails,
                required: false,
              },
            ],
            where: {
              userId: id,
              role: 'member',
            },
          },
        ],
      });

      this.logger.log('User found:', user);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(error.message, 'UserService', 'findOneById');
      console.error(`Error in findOneById:`, error);
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll<User>();
      if (!users) {
        throw new NotFoundException('No users found');
      }
      this.logger.log('Users found:', users);
      return users;
    } catch (err) {
      this.logger.error(err.message, 'UserService', 'findAllUsers');
      console.error(`Error in findAllUsers:`, err);
      throw err;
    }
  }

  async update(id: number, data: any) {
    try {
      const response = await this.userRepository.update(data, {
        where: { id },
      });
      if (!response) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const cacheKey = `user_${id}`;
      await this.cacheManager.del(cacheKey);

      this.logger.log(`User updated successfully`, response);
      return response;
    } catch (err) {
      this.logger.error(err.message, 'UserService', 'update');
      console.error(`Error in update:`, err);
      throw err;
    }
  }

  async delete(id: number) {
    try {
      const response = await this.userRepository.destroy({ where: { id } });
      this.logger.log('User deleted successfully:', response);
      return response;
    } catch (err) {
      this.logger.error(err.message, 'UserService', 'delete');
      console.error(`Error in delete:`, err);
      throw err;
    }
  }
}
