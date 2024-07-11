import { createTransporter } from '../configs/email.config';
import { ApiError } from '../utils/api-error.util';
import { StatusCodes } from 'http-status-codes';
import { appConfig } from '../configs/app.config';

export class EmailService {
    static async sendResetPasswordToken(to: string, token: string) {
        try {
            const transporter = await createTransporter();
            const resetPasswordLink = `${appConfig.client.url}/reset-password/${token}`; // Tạo đường dẫn reset password
            await transporter.sendMail({
                from: appConfig.email.emailUser,
                to,
                subject: 'Reset password',
                text: 'Your link to reset password: ' + resetPasswordLink,
            });

        } catch (error) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send email');
        }
    }
}
