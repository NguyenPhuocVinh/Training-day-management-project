import dotenv from 'dotenv'

dotenv.config()

export const appConfig = {
    port: process.env.PORT || 3000,
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    email: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
        refreshToken: process.env.REFRESH_TOKEN,
        emailUser: process.env.EMAIL_USER
    },
    client: {
        url: process.env.CLIENT_URL
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    }
}

export const dbConfig = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/project-manager',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }
}