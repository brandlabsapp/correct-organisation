import { Injectable } from '@nestjs/common';
import axios from 'axios';

const formUrlEncoded = (x: { [key: string]: string }): string =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

@Injectable()
export class OtpService {
  private msg91AuthKey: string;
  private msg91TemplateId: string;
  private msg91OtpTemplateId: string;

  constructor() {
    // MSG91 Flow API configuration
    this.msg91AuthKey = process.env.MSG91_AUTH_KEY!;
    this.msg91TemplateId = process.env.MSG91_TEMPLATE_ID!;
    this.msg91OtpTemplateId = process.env.MSG91_OTP_TEMPLATE_ID!;
  }

  async sendOtpWithMSG91Flow(
    to: string,
    variables: { [key: string]: string } = {},
    options?: {
      shortUrl?: boolean;
      shortUrlExpiry?: number;
      realTimeResponse?: boolean;
    },
  ): Promise<any> {
    try {
      if (!this.msg91AuthKey || !this.msg91TemplateId) {
        throw new Error(
          'MSG91 credentials not configured. Check MSG91_AUTH_KEY and MSG91_TEMPLATE_ID environment variables.',
        );
      }

      const url = 'https://control.msg91.com/api/v5/flow';

      const payload = {
        template_id: this.msg91TemplateId,
        short_url: options?.shortUrl ? '1' : '0',
        ...(options?.shortUrlExpiry && {
          short_url_expiry: options.shortUrlExpiry.toString(),
        }),
        ...(options?.realTimeResponse && { realTimeResponse: '1' }),
        recipients: [
          {
            mobiles: to.startsWith('91') ? to : `91${to}`,
            VAR1: variables.VAR1,
          },
        ],
      };

      const response = await axios.post(url, payload, {
        headers: {
          accept: 'application/json',
          authkey: this.msg91AuthKey,
          'content-type': 'application/json',
        },
      });

      console.log('MSG91 Flow API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending OTP via MSG91 Flow API:', error);
      throw error;
    }
  }

  async sendOtpWithMSG91(
    mobile: string,
    otp: string,
    otpExpiry: number = 10,
    realTimeResponse: boolean = true,
  ): Promise<any> {
    try {
      if (!this.msg91AuthKey || !this.msg91TemplateId) {
        throw new Error(
          'MSG91 OTP credentials not configured. Check MSG91_AUTH_KEY and MSG91_OTP_TEMPLATE_ID environment variables.',
        );
      }

      const url = 'https://control.msg91.com/api/v5/otp';
      const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

      const queryParams = new URLSearchParams({
        mobile: formattedMobile,
        otp_expiry: otpExpiry.toString(),
        template_id: this.msg91OtpTemplateId,
        realTimeResponse: realTimeResponse ? '1' : '0',
      });

      const response = await axios.post(
        `${url}?${queryParams.toString()}`,
        { otp },
        {
          headers: {
            authkey: this.msg91AuthKey,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('MSG91 OTP Send Response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('MSG91 API Error (Send):', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async verifyOtpWithMSG91(mobile: string, otp: string): Promise<any> {
    try {
      if (!this.msg91AuthKey) {
        throw new Error(
          'MSG91 OTP credentials not configured. Check MSG91_AUTH_KEY environment variable.',
        );
      }

      const url = 'https://control.msg91.com/api/v5/otp/verify';

      const queryParams = new URLSearchParams({
        otp: otp,
        mobile: mobile.startsWith('91') ? mobile : `91${mobile}`,
      });

      const response = await axios.get(`${url}?${queryParams.toString()}`, {
        headers: {
          authkey: this.msg91AuthKey,
        },
      });

      console.log('MSG91 OTP Verify Response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('MSG91 API Error (Verify):', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async resendOtpWithMSG91(
    mobile: string,
    retryType: 'text' | 'voice' = 'text',
  ): Promise<any> {
    try {
      if (!this.msg91AuthKey) {
        throw new Error(
          'MSG91 OTP credentials not configured. Check MSG91_AUTH_KEY environment variable.',
        );
      }

      const url = 'https://control.msg91.com/api/v5/otp/retry';
      const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

      const queryParams = new URLSearchParams({
        retrytype: retryType,
        mobile: formattedMobile,
      });

      const response = await axios.get(`${url}?${queryParams.toString()}`, {
        headers: {
          authkey: this.msg91AuthKey,
        },
      });

      console.log('MSG91 OTP Resend Response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('MSG91 API Error (Resend):', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw error;
    }
  }
}

