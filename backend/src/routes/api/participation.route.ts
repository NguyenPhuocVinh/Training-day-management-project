import express from 'express'
import { ParticipationController } from '../../controllers/participation.controller'

const participationRouter = express.Router();

participationRouter.post('/create', ParticipationController.create);
participationRouter.put('/cancel', ParticipationController.cancel);
participationRouter.get('/non-participants', ParticipationController.getNonParticipants);
participationRouter.get('/all', ParticipationController.getAllParticipations);
participationRouter.get('/participants', ParticipationController.getParticipants);

export default participationRouter;
