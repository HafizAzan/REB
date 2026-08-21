import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpPurpose } from '@prisma/client';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendOtp(email: string, code: string, purpose: OtpPurpose) {
    const { subject, text, html } = this.otpContent(code, purpose);
    const host = this.config.get<string>('SMTP_HOST');

    if (!host) {
      this.logger.log(`OTP for ${email} [${purpose}]: ${code}`);
      return;
    }

    const port = Number(this.config.get('SMTP_PORT') ?? 587);
    const transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: this.config.get('SMTP_USER')
        ? {
            user: this.config.getOrThrow<string>('SMTP_USER'),
            pass: this.config.getOrThrow<string>('SMTP_PASS'),
          }
        : undefined,
    });

    await transporter.sendMail({
      from: this.config.get('SMTP_FROM') ?? 'EstateX <noreply@estatex.dev>',
      to: email,
      subject,
      text,
      html,
    });
  }

  private otpContent(code: string, purpose: OtpPurpose) {
    const copy = {
      REGISTER: {
        subject: 'Verify your EstateX account',
        intro: 'Use this code to finish creating your EstateX account.',
      },
      LOGIN: {
        subject: 'Your EstateX sign-in code',
        intro: 'Use this code to verify your email and sign in.',
      },
      RESET_PASSWORD: {
        subject: 'Reset your EstateX password',
        intro: 'Use this code to reset your EstateX password.',
      },
      CHANGE_EMAIL: {
        subject: 'Confirm your new EstateX email',
        intro: 'Use this code to confirm this email as your new EstateX address.',
      },
    }[purpose];

    const text = `${copy.intro}\n\nYour code is ${code}.\nIt expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;
    const html = `
      <div style="font-family:Georgia,serif;color:#161513;line-height:1.5">
        <p>${copy.intro}</p>
        <p style="font-size:28px;letter-spacing:8px;font-weight:600">${code}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `;

    return { subject: copy.subject, text, html };
  }
}
