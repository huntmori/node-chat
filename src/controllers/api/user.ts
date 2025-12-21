import express, {Request, Response, Router} from "express";
import {BaseRequest, error, ok, Payload} from "../../dtos/BaseDto";
import {PostUserCreate} from "../../dtos/PostUserCreate";
import {getLogger} from "../../config/logger";
import {BaseRequest as BRequest} from '../../dtos/BaseRequest'
import {UserService} from "../../services/UserService";
import {container} from "tsyringe";
import {ApiException} from "../../exceptions/ApiException";
import {User, UserColumns} from "../../models/User";
import {UserPayload} from "../../dtos/UserPayload";


const router:Router = express.Router()
const logger = getLogger();

const service:UserService = container.resolve(UserService);

router.post(
    '/api/user',
    async (req: Request, res: Response) => {
        logger.info(req.body);
        const body = req.body as BaseRequest;
        const data = body.payload as Payload;
        let dto = BRequest.plainToInstance(PostUserCreate, data);

        const errors = await dto.validate();

        if(errors.length > 0) {
            res.json(error('user.create', errors.map(e => e.toString())));
            return;
        }

        let member = null;

        try {
            member = await service.memberCreate(dto);
        } catch (e) {
            if (e instanceof ApiException)
            {
                res.json(error('user.create', e.message))
                return;
            }

            e = e as Error;
            res.json(error('user.create', (e as Error).message))
            return;
        }

        const payload: UserPayload = {
            id: member?.id,
            uid: member?.uid,
            username: member?.username,
            created_at: member?.created_at,
            updated_at: member?.updated_at,
        };
        res.json(ok('user.create', payload))
        return;
    }
);

router.get(
    "/api/user/:uid",
    async (req: Request, res: Response) => {
        const uid = req.params.uid;

        const member = await service.getOne(UserColumns.uid, uid);

        if (member === null) {
            res.json(error('user.get', 'user not found'));
            return;
        }

        const payload: UserPayload = {
            id: member?.id,
            uid: member?.uid,
            username: member?.username,
            created_at: member?.created_at,
            updated_at: member?.updated_at,
        };

        res.json(ok('user.get', payload));
        return;
    }
)

export default router;