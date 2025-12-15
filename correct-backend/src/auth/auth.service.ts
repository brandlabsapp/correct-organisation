import { CompanyMembersService } from './../company/company-members/company-members.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '@/otp/otp.service';
import { User } from '@/user/entity/user.entity';
import { jwtConstants } from '@/core/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly companyMembersService: CompanyMembersService,
    private readonly otpService: OtpService,
  ) {}

  async signIn(phone: string): Promise<User> {
    try {
      let user = null;
      user = await this.usersService.findOneByPhone(phone);
      if (!user) {
        user = await this.usersService.create({ phone });
      }
      // Use MSG91 OTP API instead of generating and storing OTP locally
      const otp = Math.floor(100000 + Math.random() * 900000);
      await this.usersService.update(user.id, { otp: otp.toString() });
      await this.otpService.sendOtpWithMSG91(phone, otp.toString());
      return user;
    } catch (error) {
      throw error;
    }
  }

  // async signUp(phone: string): Promise<Record<string, any>> {
  //   try {
  //     const existingUser = await this.usersService.findOneByPhone(phone);
  //     if (existingUser) {
  //       this.logger.error('User already exists', 'AuthService', 'signUp');
  //       throw new ConflictException(
  //         'User already exists, please go to sign in!',
  //       );
  //     }
  //     const newUser = await this.usersService.create({ phone });
  //     const payload = {
  //       id: newUser.id,
  //       userToken: newUser.userToken,
  //     };

  //     const otp = Math.floor(100000 + Math.random() * 900000);
  //     await this.otpService.sendOtpWithMSG91Flow(newUser.phone, {
  //       VAR1: otp.toString(),
  //     });
  //     return {
  //       access_token: await this.jwtService.signAsync(payload, {
  //         expiresIn: jwtConstants.expiresIn,
  //       }),
  //     };
  //   } catch (error) {
  //     this.logger.error(error.message, 'AuthService', 'signUp');
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // * To enable user registration, uncomment the following code:
  // async signUpUser(data: RegisterDTO): Promise<Record<string, any>> {
  //   try {
  //     const newUser = await this.usersService.create(data);
  //     const payload = {
  //       id: newUser.id,
  //       userToken: newUser.userToken,
  //     };
  //     const jwt = await this.jwtService.signAsync(payload);
  //     newUser['access_token'] = jwt;

  //     return newUser;
  //   } catch (error) {
  //     console.error('Error signing up:', error);
  //     throw new Error(error);
  //   }
  // }

  async verifyOtp(data: {
    phone: string;
    otp: string;
    token: string | null;
  }): Promise<Record<string, any>> {
    try {
      const userData = await this.usersService.findOneByPhone(data.phone);
      if (!userData) {
        this.logger.error(
          'No user found for this phone number',
          'AuthService',
          'verifyOtp',
        );
        throw new NotFoundException('No user found for this phone number');
      }

      // Use MSG91 OTP verification instead of local OTP validation
      const otpVerification = await this.otpService.verifyOtpWithMSG91(
        data.phone,
        data.otp,
      );
      if (!otpVerification || otpVerification.type !== 'success') {
        this.logger.error('Invalid OTP', 'AuthService', 'verifyOtp');
        throw new BadRequestException('Invalid OTP');
      }
      await this.usersService.update(userData.id, { otpVerified: true });

      if (data.token) {
        const updatedData = await this.companyMembersService.update(
          {
            status: 'active',
            acceptedAt: new Date(),
            lastAccessedAt: new Date(),
          },
          { invitationToken: data.token, userId: userData.id },
        );
        if (!updatedData) {
          throw new BadRequestException('Invalid token or user');
        }
      }

      const payload = {
        id: userData.id,
        userToken: userData.userToken,
      };

      const jwt = await this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.expiresIn,
      });
      userData.dataValues['access_token'] = jwt;
      return userData;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new BadRequestException('OTP verification failed');
    }
  }

  async resendOtp(phone: string): Promise<boolean> {
    try {
      const user = await this.usersService.findOneByPhone(phone);
      if (!user) {
        throw new NotFoundException(`User not found with the phone ${phone}`);
      }
      await this.otpService.resendOtpWithMSG91(phone);
      return true;
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw new BadRequestException(error.message);
    }
  }
}
