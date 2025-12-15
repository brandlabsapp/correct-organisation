import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/core/constants';
import { CompanyMembersModule } from '@/company/company-members/company-members.module';
import { OtpService } from '@/otp/otp.service';
import { NotificationModule } from '@/notification/notification.module';
import { PushService } from '@/notification/push/push.service';

@Module({
  imports: [
    UserModule,
    CompanyMembersModule,
    NotificationModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, PushService],
})
export class AuthModule {}
