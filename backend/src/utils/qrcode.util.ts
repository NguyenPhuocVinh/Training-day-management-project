import QRCode from 'qrcode'
import { IParticipation } from '../types/global'

export function generateQRCode(data: IParticipation) {
    const { userId, programId } = data;

    const stringData = `userId: ${userId} - programId: ${programId}`;

    return QRCode.toDataURL(stringData);
}