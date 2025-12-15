import { Injectable } from '@nestjs/common';
import axios from 'axios';

const formUrlEncoded = (x: { [key: string]: string }): string =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

@Injectable()
export class OtpService {
  private msg91: any;
  private apiKey: string;
  private token: string;
  private sid: string;
  private from: string;
  private dltEntityId: string;
  private dltTemplateId: string;

  private msg91AuthKey: string;
  private msg91TemplateId: string;
  private msg91OtpTemplateId: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY!;
    this.token = process.env.SMS_API_SECRET!;
    this.sid = process.env.SMS_SENDER_ID!;
    this.dltEntityId = process.env.SMS_DLT_ENTITY_ID!;
    this.dltTemplateId = process.env.SMS_DLT_TEMPLATE_ID!;
    this.from = 'CORRCT';

    // MSG91 Flow API configuration
    this.msg91AuthKey = process.env.MSG91_AUTH_KEY!;
    this.msg91TemplateId = process.env.MSG91_TEMPLATE_ID!;
    this.msg91OtpTemplateId = process.env.MSG91_OTP_TEMPLATE_ID!;
  }

  async sendSMSWithExotel(to: string, otp: string | null) {
    const body = `Dear User, please proceed with this OTP ${otp}. From Myna Mahila Foundation`;

    const url = `https://${this.apiKey}:${this.token}@api.exotel.com/v1/Accounts/${this.sid}/Sms/send`;

    console.log('url', url);

    axios
      .post(
        url,
        formUrlEncoded({
          From: this.from,
          To: `91${to}`,
          Body: body,
          DltEntityId: this.dltEntityId,
          DltTemplateId: this.dltTemplateId,
        }),
        {
          withCredentials: true,
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((res: any) => {
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
      })
      .catch((error: any) => {
        console.error('error', error);
      });
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

      const queryParams = new URLSearchParams({
        mobile: mobile.startsWith('91') ? mobile : `91${mobile}`,
        authkey: this.msg91AuthKey,
        otp_expiry: otpExpiry.toString(),
        template_id: this.msg91OtpTemplateId,
        realTimeResponse: realTimeResponse ? '1' : '0',
      });

      const body = JSON.stringify({ otp: otp });

      const response = await axios.post(
        `${url}?${queryParams.toString()}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('MSG91 OTP Send Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending OTP via MSG91 OTP API:', error);
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
      console.error('Error verifying OTP via MSG91 OTP API:', error);
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

      const queryParams = new URLSearchParams({
        authkey: this.msg91AuthKey,
        retrytype: retryType,
        mobile: mobile.startsWith('91') ? mobile : `91${mobile}`,
      });

      const response = await axios.get(`${url}?${queryParams.toString()}`);

      console.log('MSG91 OTP Resend Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error resending OTP via MSG91 OTP API:', error);
      throw error;
    }
  }
}
