import {singleton} from "tsyringe";
import {BaseService} from "./BaseService";
import {ProfileRepository} from "../repositories/ProfileRepository";
import {ProfileColumns, Profile} from "../models/Profile";
import {User} from "../models/User";

@singleton()
export class ProfileService extends BaseService
{
    private profileRepository: ProfileRepository;

    constructor(
        profileRepository: ProfileRepository
    ) {
        super();
        this.profileRepository = profileRepository;
        this.logger.info('profile service created');
    }

    async getOne(col: ProfileColumns, val: string)
    {
        return this.profileRepository.getOne(col, val)
    }

    async createOne(user: User, nickName: string)
    {
        return this.profileRepository.createOne(user, nickName);
    }

    async createProfile(user: User, nickname: string): Promise<Profile | null>
    {
        const nicknameExist = await this.getOne(ProfileColumns.nickname, nickname);

        if (nicknameExist) {
            // error
        }

        const profile = await this.createOne(user, nickname);

        if (profile === null) {
            // error
        }

        return profile;
    }
}