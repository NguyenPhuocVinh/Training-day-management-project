import mongoose, { Document, Schema } from 'mongoose'
// import moment from 'moment'
import { IToken } from '../types/global'
import moment from 'moment-timezone'

interface TokenDocument extends IToken, Document {
    checkExpires: () => boolean;
}

const TokenSchema = new Schema<TokenDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['refresh_token', 'reset_password']
    },
    expiresTime: {
        type: Date,
        required: true
    }
}, { timestamps: true })

// Method to check if the token is expired
TokenSchema.method('checkExpires', function checkExpires() {
    const expiresTimeDate = moment(this.expiresTime).toDate();
    const checkDate = moment().isBefore(expiresTimeDate);
    console.log(checkDate);
    return checkDate
})

export const TokenModel = mongoose.model<TokenDocument>('Token', TokenSchema)
