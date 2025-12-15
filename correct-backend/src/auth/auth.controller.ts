import {
  Get,
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, VerifyOtpDTO } from './constants/auth.dto';
import { Public } from './public.decorator';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { Auth } from './auth.decorator';
import { NotificationService } from '@/notification/notification.service';
import { PushService } from '@/notification/push/push.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly pushService: PushService,
  ) {}

  @Public()
  @ApiBody({ type: AuthDTO })
  @Post('login')
  async signIn(@Body() signInDto: AuthDTO) {
    try {
      console.log(signInDto);
      const user = await this.authService.signIn(signInDto.phone);

      if (user.deviceToken) {
        const pushNotification =
          await this.pushService.sendPushNotificationToDeviceToken(
            user.deviceToken,
            'User Login from FCM',
            'User logged in successfully from FCM',
          );
        console.log(pushNotification);
      }
      // create notification object
      const notificationObject =
        await this.notificationService.createNotificationObject({
          title: 'User Login',
          message: 'User logged in successfully',
          userId: user.id,
          priority: 'high',
          frequency: 'daily',
          persistent: true,
        });
      // create notification
      const notification = await this.notificationService.createNotification({
        notificationObjectId: notificationObject.id,
        notifierId: [user.id],
      });
      console.log(notification);
      // create notification change
      const notificationChange =
        await this.notificationService.createNotificationChange({
          notificationObjectId: notificationObject.id,
          userId: user.id,
        });
      console.log(notificationChange);
      return { message: 'User logged in successfully', user };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // @Public()
  // @HttpCode(HttpStatus.CREATED)
  // @ApiCreatedResponse()
  // @Post('signup')
  // async register(@Body() registerDto: RegisterDTO) {
  //   const token = await this.authService.signUp(registerDto.phone);
  //   console.log(token);
  //   return { message: 'User registered successfully', token };
  // }

  // @Public()
  // @HttpCode(HttpStatus.CREATED)
  // @ApiCreatedResponse()
  // @Post('signup-user')
  // async registerUser(@Body() registerDto: RegisterDTO) {
  //   const user = await this.authService.signUpUser(registerDto);
  //   console.log(user);
  //   return { message: 'User registered successfully', user };
  // }

  @Public()
  @ApiBody({ type: VerifyOtpDTO })
  @Post('verify-otp')
  async verifyOtp(@Body() data: VerifyOtpDTO) {
    const token = await this.authService.verifyOtp(data);
    console.log(token);
    return { message: 'OTP verified successfully', data: token };
  }

  @Public()
  @Post('resend-otp')
  async resendOtp(@Body() data: { phone: string }) {
    try {
      const token = await this.authService.resendOtp(data.phone);
      return { message: 'OTP resent successfully', token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to resend OTP');
    }
  }

  @Get('profile')
  @Auth('user')
  getProfile(@Request() req) {
    try {
      console.log(req.user);
      return req.user;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }
}
