import express from 'express'
import { EvidenceController } from '../../controllers/evidence.controller'

const evidenceRouter = express.Router()

evidenceRouter.post('/create', EvidenceController.create)
evidenceRouter.put('/feedback/:evidenceId', EvidenceController.feedback)

export default evidenceRouter