import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import cloudinary from '../configs/cloudinary.config'
import fs from 'fs'
import { singleUpload } from '../utils/upload.util'
import { EvidenceService } from '../services/evidence.service'
import { IEvidence } from '../types/global'

export class EvidenceController {
    static async create(req: Request, res: Response) {
        singleUpload(req, res, async (err: any) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
            }
            try {
                const evidenceReq: IEvidence = req.body;
                if (!evidenceReq) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid request');
                }
                const { path: imagePath } = req.file;


                const uploadedImage = await cloudinary.uploader.upload(imagePath, {
                    folder: "NRL/Evidences",
                });
                if (!uploadedImage || !uploadedImage.url) {
                    throw new Error("Failed to upload image to Cloudinary");
                }
                evidenceReq.image = uploadedImage.url;
                const program = await EvidenceService.create(evidenceReq);
                fs.unlinkSync(imagePath);
                res.status(StatusCodes.CREATED).json({ program });
            } catch (error: any) {
                res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
            }
        });
    }

    static async feedback(req: Request, res: Response) {
        try {
            const { evidenceId } = req.params;
            const feedbackAdminId = req.user._id;
            const evidenceReq: IEvidence = req.body;
            evidenceReq.feedbackAdminId = feedbackAdminId;
            const updatedEvidence = await EvidenceService.feedback(evidenceId, evidenceReq);
            res.status(StatusCodes.OK).json({ evidence: updatedEvidence });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}