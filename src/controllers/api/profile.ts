import express, {Request, Response, Router} from "express";
import {getLogger} from "../../config/logger";
import {container} from "tsyringe";
import {getUser} from "../../services/jwt";
import {UserColumns} from "../../models/User";
import {UserService} from "../../services/UserService";
import {ProfileService} from "../../services/ProfileService";
import {error} from "../../dtos/BaseDto";
import {ApiException} from "../../exceptions/ApiException";

const router:Router = express.Router()
const logger = getLogger();

const userService: UserService = container.resolve(UserService);
const profileService: ProfileService = container.resolve(ProfileService);
router.post(
    '/api/profile',
    async (req: Request, res: Response) => {
        const body = req.body;
        logger.info('[POST] /api/profile', body);

        let token = '';
        let userInfo = null;
        try {
            token = req.headers.authorization || '';
            userInfo = await getUser(token);
            logger.info('userInfo', userInfo);
        } catch (e) {
            if (e instanceof ApiException) {
                res.json(
                    error('profile.create', e.message)
                );
                return;
            }
        }

        if (!userInfo) {
            res.json(
                error('profile.create', 'user not found')
            );
            return;
        }

        if (!body.nickname) {
            res.json(
                error('profile.create', 'nickname is required')
            );
            return;
        }

        const user = await userService.getOne(UserColumns.username, userInfo?.userId || '');

        if (user === null) {
            // error
            res.json(error('profile.create', 'user not found'))
            return;
        }

        const profile = await profileService.createProfile(user, body.nickname)

        res.json(profile);
        return;
    }
).get(
    '/api/profile/:uid',
    async (req: Request, res: Response) => {
        const uid = req.params.uid;
        logger.info('[GET] /api/profile/:uid', uid);
    }
).patch(
    '/api/profile/nickname',
    async (req: Request, res: Response) => {
        const body = req.body;
        logger.info('[PATCH] /api/profile/nickname', body)
    }
).delete(
    '/api/profile/:uid',
    async (req: Request, res: Response) => {
        const uid = req.params.uid;
        logger.info('[DELETE] /api/profile/:uid', uid);
    }
)

export default router;