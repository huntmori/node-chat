import express, {Request, Response, Router} from "express";
import {getLogger} from "../../config/logger";
import {container} from "tsyringe";
import {getUserByAccessToken, getUserByRequest} from "../../services/jwt";
import {ProfileService} from "../../services/ProfileService";
import {errorResponse, okResponse} from "../../dtos/BaseDto";
import {ApiException} from "../../exceptions/ApiException";
import {ProfileColumns} from "../../models/Profile";
import {ProfileDto} from "../../dtos/ProfileDto";
import {BaseRequest} from "../../dtos/BaseRequest";
import {plainToInstance} from "class-transformer";

const router:Router = express.Router()
const logger = getLogger();

const profileService: ProfileService = container.resolve(ProfileService);
router.post(
    '/api/profile',
    async (req: Request, res: Response) => {
        const body = req.body;
        logger.info('[POST] /api/profile', body);

        try {
            if (!body.nickname) {
                errorResponse(res, 'profile.create', 'nickname is required');
                return;
            }

            const user = await getUserByRequest(req);

            if (user === null) { // error
                errorResponse(res, 'profile.create', 'user not found')
                return;
            }

            const profile = await profileService.createProfile(user, body.nickname)

            okResponse(res, 'profile.create', BaseRequest.plainToInstance(ProfileDto, profile));
            return;
        } catch (e) {
            if (e instanceof ApiException) {
                errorResponse(res, 'profile.create', e.message)
                return;
            }
        }
    }
).get(
    '/api/profile/:uid',
    async (req: Request, res: Response) => {
        const uid = req.params.uid;
        logger.info('[GET] /api/profile/:uid', uid);
    }
).get(
    '/api/profile/me',
    async (req: Request, res: Response) => {
        const body = req.body;
        logger.info('[POST] /api/profile', body);

        try {
            const user = await getUserByRequest(req);

            const profiles = await profileService.getList([
                {
                    column: ProfileColumns.user_uid,
                    value: user.uid
                }
            ]) ?? [];

            const dtos = profiles.map(profile=> {
                return plainToInstance(ProfileDto, profile);
            });

            okResponse(res, 'profile.get', dtos);
        } catch(e) {
            errorResponse(res, 'profile.get', 'error while get profile')
            return;
        }
    }
).patch(
    '/api/profile/:uid/nickname',
    async (req: Request, res: Response) => {
        const body = req.body;
        const uid = req.params.uid;
        logger.info('[PATCH] /api/profile/nickname', body)
        const ACTION_NAME: string = "profile.patch.nickname"
        try {
            const user = await getUserByRequest(req);
            const profile = await profileService.getOne(ProfileColumns.uid, uid);

            const result = await profileService.changeNickname(user, profile, body.nickname);

        } catch (e) {
            errorResponse(
                res,
                ACTION_NAME,
                (e as Error).message
            );
            return;
        }

    }
).delete(
    '/api/profile/:uid',
    async (req: Request, res: Response) => {
        const uid = req.params.uid;
        logger.info('[DELETE] /api/profile/:uid', uid);
    }
)

export default router;