import { WebService } from './services/web.service'
import { InitMongoDB } from './helpers/init.mongodb'

const start = async () => {
    try {
        await InitMongoDB.connect()
        await WebService.start()
    } catch (error: any) {
        console.error(error)
    }
}

start().then(() => {
    console.log('Server started')
});