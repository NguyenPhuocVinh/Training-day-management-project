import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error.util';
import cloudinary from '../configs/cloudinary.config';
import fs from 'fs';
import { singleUpload } from '../utils/upload.util';
import { ProgramService } from '../services/program.service';
import { IProgram } from '../types/global';

export class ProgramController {
    static async create(req: Request, res: Response) {
        singleUpload(req, res, async (err: any) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
            }
            try {
                const adminId = req.user._id as string;
                const createProgramRequest: IProgram = req.body;
                if (!createProgramRequest) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid request');
                }
                const { programName, categoryId, description, startDate, registerDate, endRegisterDate } = createProgramRequest;
                if (!programName || !categoryId || !description || !startDate || !registerDate || !endRegisterDate) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, 'Program name is required');
                }
                const { path: imagePath } = req.file;


                const uploadedImage = await cloudinary.uploader.upload(imagePath, {
                    folder: "NRL/Programs",
                });
                if (!uploadedImage || !uploadedImage.url) {
                    throw new Error("Failed to upload image to Cloudinary");
                }
                createProgramRequest.image = uploadedImage.url;
                createProgramRequest.adminId = adminId;
                const program = await ProgramService.create(createProgramRequest);
                fs.unlinkSync(imagePath);
                res.status(StatusCodes.CREATED).json({ program });
            } catch (error: any) {
                console.log(error);
                res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
            }
        });
    }

    static async update(req: Request, res: Response) {
        singleUpload(req, res, async (err: any) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
            }

            try {
                const programId = req.params.programId as string;
                const updateProgramRequest: IProgram = req.body;
                const newImage = req.file ? req.file.path : null;
                if (newImage) {
                    const uploadedImage = await cloudinary.uploader.upload(newImage, {
                        folder: "NRL/Programs",
                    });
                    updateProgramRequest.image = uploadedImage.url;
                    fs.unlinkSync(newImage);
                }
                const program = await ProgramService.update(programId, updateProgramRequest);
                res.status(StatusCodes.OK).json({ program });
            } catch (error: any) {
                res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
            }
        });
    }

    static async delete(req: Request, res: Response) {
        try {
            const programId = req.query.programId as string;
            const program = await ProgramService.delete(programId);
            res.status(StatusCodes.OK).json({ program });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async approve(req: Request, res: Response) {
        try {
            const programId = req.query.programId as string;
            const program = await ProgramService.approve(programId);
            res.status(StatusCodes.OK).json({ program });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async reject(req: Request, res: Response) {
        try {
            const programId = req.query.programId as string;
            const program = await ProgramService.reject(programId);
            res.status(StatusCodes.OK).json({ program });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async getPrograms(req: Request, res: Response) {
        try {
            const programs = await ProgramService.getPrograms();
            res.status(StatusCodes.OK).json({ programs });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async getProgramById(req: Request, res: Response) {
        try {
            const programId = req.params.programId as string;
            const program = await ProgramService.getProgramById(programId);
            res.status(StatusCodes.OK).json({ program });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}