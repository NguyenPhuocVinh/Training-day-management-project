import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';
import { appConfig } from './app.config';

const o2Auth2Client = new google.auth.OAuth2(
    appConfig.email.clientId,
    appConfig.email.clientSecret,
    appConfig.email.redirectUri
);


o2Auth2Client.setCredentials({ refresh_token: appConfig.email.refreshToken });


function getAccessToken() {
    return new Promise((resolve, reject) => {
        o2Auth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token ");
            }
            resolve(token);
        });
    });
}

export function createTransporter(): Promise<nodemailer.Transporter> {
    return new Promise(async (resolve, reject) => {
        const accessToken = await getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: appConfig.email.emailUser,
                clientId: appConfig.email.clientId,
                clientSecret: appConfig.email.clientSecret,
                refreshToken: appConfig.email.refreshToken,
                accessToken
            }
        } as SMTPTransport.Options);
        resolve(transporter);
    });
}