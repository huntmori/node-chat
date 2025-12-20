import {BaseService} from "./BaseService";
import {UserRepository} from "../repositories/UserRepository";
import {inject, singleton} from "tsyringe";
import {User, UserColumns} from "../models/User";
import {PostUserCreate} from "../dtos/PostUserCreate";
import {ApiException} from "../exceptions/ApiException";

@singleton()
export class UserService extends BaseService
{
    protected userRepository: UserRepository;

    constructor(
        userRepository: UserRepository
    ) {
        super();
        this.userRepository = userRepository
        this.logger.info('user service created');
    }

    async getOne(col: UserColumns, val: string)
    {
        return this.userRepository.getOne(col, val);
    }

    async memberCreate(dto: PostUserCreate)
    {
        let idExists = await this.userRepository.getOne(UserColumns.username, dto.id);
        let emailExists = await this.userRepository.getOne(UserColumns.email, dto.email);

        if(idExists !== null) {
            throw new ApiException("user already exists", 409, "USER_ALREADY_EXISTS")
        }
        if(emailExists !== null) {
            throw new ApiException("email already exists", 409, "USER_EMAIL_EXISTS")
        }

        const param = new User()
        param.username = dto.id;
        param.password = dto.password;
        param.email = dto.email;

        const member = await this.userRepository.createOne(param);

        if(member === null) {
            throw new ApiException("error", 503, "INTERNAL_SERVER_ERROR")
        }

        return member;
    }
}