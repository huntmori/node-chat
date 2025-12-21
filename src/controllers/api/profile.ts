import express, {Request, Response, Router} from "express";
import {getLogger} from "../../config/logger";
import {container} from "tsyringe";

const router:Router = express.Router()
const logger = getLogger();


router.post(
    '/api/profile',
    async (req: Request, res: Response) => {
        logger.info('[POST] /api/profile', req.body);
        
    }
)

export default router;