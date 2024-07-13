import express from 'express'
import { ParticipationController } from '../../controllers/participation.controller'

const participationRouter = express.Router();

participationRouter.post('/create', ParticipationController.create);
participationRouter.put('/cancel', ParticipationController.cancel);

export default participationRouter;
