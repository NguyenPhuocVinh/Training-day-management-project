import { appConfig } from './app.config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: appConfig.cloudinary.cloud_name,
    api_key: appConfig.cloudinary.api_key,
    api_secret: appConfig.cloudinary.api_secret,
    secure: true
})

export default cloudinary