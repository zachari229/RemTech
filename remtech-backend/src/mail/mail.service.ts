import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true pour le port 465, false pour 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOrderConfirmation(params: {
    to: string;
    firstName: string;
    courseTitle: string;
    courseSlug: string;
    amount: number;
  }) {
    const { to, firstName, courseTitle, courseSlug, amount } = params;
    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard/courses/${courseSlug}`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: `Confirmation de votre achat — ${courseTitle}`,
        html: this.buildConfirmationTemplate({
          firstName,
          courseTitle,
          amount,
          dashboardUrl,
        }),
      });
      this.logger.log(`Email de confirmation envoyé à ${to}`);
    } catch (error) {
      // On ne bloque jamais le flux métier si l'email échoue
      this.logger.error(`Échec envoi email à ${to} : ${error.message}`);
    }
  }

  async sendContactReply(params: {
  to: string;
  firstName: string;
  originalSubject: string;
  originalMessage: string;
  reply: string;
}) {
  const { to, firstName, originalSubject, originalMessage, reply } = params;

  try {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Réponse à votre message — ${originalSubject}`,
      html: this.buildReplyTemplate({ firstName, originalSubject, originalMessage, reply }),
    });
    this.logger.log(`Email de réponse envoyé à ${to}`);
  } catch (error) {
    this.logger.error(`Échec envoi email de réponse à ${to} : ${error.message}`);
    
    throw error;
  }
}

private buildReplyTemplate(params: {
  firstName: string;
  originalSubject: string;
  originalMessage: string;
  reply: string;
}) {
  const { firstName, originalSubject, originalMessage, reply } = params;

  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin:0; padding:0; background-color:#0a0e1a; font-family:'Inter', Arial, sans-serif; color:#e2e5ec; }
      .container { max-width:560px; margin:40px auto; background-color:#11172a; border-radius:12px; overflow:hidden; border:1px solid #1f2740; }
      .header { background-color:#0d1326; padding:32px 40px; text-align:center; border-bottom:2px solid #ff7a1a; }
      .header h1 { font-family:'Cormorant Garamond', serif; font-size:28px; color:#ffffff; margin:0; }
      .header span { color:#ff7a1a; }
      .body { padding:40px; }
      .body p { font-size:15px; line-height:1.6; color:#c4c9d6; }
      .badge { display:inline-block; background-color:rgba(255,122,26,0.12); color:#ff7a1a; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600; margin-bottom:20px; }
      .original-box { background-color:#0d1326; border-left:3px solid #5a6178; border-radius:6px; padding:16px 20px; margin:20px 0; }
      .original-box p { margin:0; font-size:13px; color:#8b91a5; font-style:italic; white-space:pre-line; }
      .reply-box { background-color:#0d1326; border-left:3px solid #ff7a1a; border-radius:6px; padding:20px 24px; margin:20px 0; }
      .reply-box p { margin:0; font-size:14.5px; color:#e2e5ec; white-space:pre-line; line-height:1.6; }
      .footer { padding:24px 40px; text-align:center; font-size:12px; color:#5a6178; border-top:1px solid #1f2740; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Rem<span>Tech</span></h1></div>
      <div class="body">
        <span class="badge">Réponse à votre message</span>
        <p>Bonjour ${firstName},</p>
        <p>Nous avons répondu au message que vous nous avez envoyé concernant : <strong>${originalSubject}</strong></p>
        <div class="original-box"><p>${originalMessage}</p></div>
        <div class="reply-box"><p>${reply}</p></div>
        <p style="margin-top:32px; font-size:13px; color:#8b91a5;">
          Pour toute question complémentaire, répondez simplement à cet email.
        </p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} RemTech — Tous droits réservés.</div>
    </div>
  </body>
  </html>
  `;
}

  private buildConfirmationTemplate(params: {
    firstName: string;
    courseTitle: string;
    amount: number;
    dashboardUrl: string;
  }) {
    const { firstName, courseTitle, amount, dashboardUrl } = params;

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0a0e1a;
          font-family: 'Inter', Arial, sans-serif;
          color: #e2e5ec;
        }
        .container {
          max-width: 560px;
          margin: 40px auto;
          background-color: #11172a;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #1f2740;
        }
        .header {
          background-color: #0d1326;
          padding: 32px 40px;
          text-align: center;
          border-bottom: 2px solid #ff7a1a;
        }
        .header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .header span {
          color: #ff7a1a;
        }
        .body {
          padding: 40px;
        }
        .body p {
          font-size: 15px;
          line-height: 1.6;
          color: #c4c9d6;
        }
        .badge {
          display: inline-block;
          background-color: rgba(255, 122, 26, 0.12);
          color: #ff7a1a;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .course-box {
          background-color: #0d1326;
          border: 1px solid #1f2740;
          border-radius: 8px;
          padding: 20px 24px;
          margin: 24px 0;
        }
        .course-box h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #ffffff;
          margin: 0 0 8px 0;
        }
        .course-box p {
          margin: 0;
          font-size: 14px;
          color: #8b91a5;
        }
        .cta {
          display: inline-block;
          background-color: #ff7a1a;
          color: #0a0e1a !important;
          text-decoration: none;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 8px;
          margin-top: 16px;
          font-size: 15px;
        }
        .footer {
          padding: 24px 40px;
          text-align: center;
          font-size: 12px;
          color: #5a6178;
          border-top: 1px solid #1f2740;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rem<span>Tech</span></h1>
        </div>
        <div class="body">
          <span class="badge">Paiement confirmé</span>
          <p>Bonjour ${firstName},</p>
          <p>Votre achat a été validé avec succès. Vous avez désormais un accès complet à votre formation.</p>

          <div class="course-box">
            <h2>${courseTitle}</h2>
            <p>Montant payé : ${amount.toLocaleString('fr-FR')} FCFA</p>
          </div>

          <p>Vous pouvez accéder à votre formation dès maintenant depuis votre tableau de bord.</p>
          <a href="${dashboardUrl}" class="cta">Accéder à ma formation</a>

          <p style="margin-top: 32px; font-size: 13px; color: #8b91a5;">
            Si vous avez la moindre question, n'hésitez pas à nous contacter.
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} RemTech — Tous droits réservés.
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async sendResetCode(params: { to: string; firstName: string; code: string }) {
  const { to, firstName, code } = params;

  try {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Votre code de réinitialisation — RemTech',
      html: this.buildResetCodeTemplate({ firstName, code }),
    });
    this.logger.log(`Email de réinitialisation envoyé à ${to}`);
  } catch (error) {
    this.logger.error(`Échec envoi code reset à ${to} : ${error.message}`);
    throw error;
  }
}

private buildResetCodeTemplate(params: { firstName: string; code: string }) {
  const { firstName, code } = params;

  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin:0; padding:0; background-color:#0a0e1a; font-family:'Inter', Arial, sans-serif; color:#e2e5ec; }
      .container { max-width:560px; margin:40px auto; background-color:#11172a; border-radius:12px; overflow:hidden; border:1px solid #1f2740; }
      .header { background-color:#0d1326; padding:32px 40px; text-align:center; border-bottom:2px solid #ff7a1a; }
      .header h1 { font-family:'Cormorant Garamond', serif; font-size:28px; color:#ffffff; margin:0; }
      .header span { color:#ff7a1a; }
      .body { padding:40px; }
      .body p { font-size:15px; line-height:1.6; color:#c4c9d6; }
      .badge { display:inline-block; background-color:rgba(255,122,26,0.12); color:#ff7a1a; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600; margin-bottom:20px; }
      .code-box { background-color:#0d1326; border:1px solid #1f2740; border-radius:8px; padding:28px; margin:24px 0; text-align:center; }
      .code { font-family:'Courier New', monospace; font-size:36px; font-weight:700; letter-spacing:10px; color:#ff7a1a; }
      .footer { padding:24px 40px; text-align:center; font-size:12px; color:#5a6178; border-top:1px solid #1f2740; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Rem<span>Tech</span></h1></div>
      <div class="body">
        <span class="badge">Réinitialisation de mot de passe</span>
        <p>Bonjour ${firstName},</p>
        <p>Voici votre code de réinitialisation. Il est valable pendant 15 minutes.</p>
        <div class="code-box">
          <span class="code">${code}</span>
        </div>
        <p style="margin-top:24px; font-size:13px; color:#8b91a5;">
          Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email — votre mot de passe restera inchangé.
        </p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} RemTech — Tous droits réservés.</div>
    </div>
  </body>
  </html>
  `;
}
}