import {singleton} from "tsyringe";
import {BaseService} from "./BaseService";
import {ProfileRepository} from "../repositories/ProfileRepository";
import {ProfileColumns, Profile} from "../models/Profile";
import {User} from "../models/User";
import {ApiException} from "../exceptions/ApiException";

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

    async createProfile(user: User, nickname: string): Promise<Profile>
    {
        const nicknameExist = await this.getOne(ProfileColumns.nickname, nickname);

        if (nicknameExist !== null) {
            throw new ApiException(
                'nickname already used',
                400,
                'profile.create'
            );
        }

        const profile = await this.createOne(user, nickname);

        if (profile === null) {
            throw new ApiException(
                'profile creation error',
                400,
                'profile.create'
            );        }

        return profile;
    }

    async getList(param: { column: ProfileColumns; value: string }[]) {
        return this.profileRepository.getList(param);
    }

    async changeNickname(user: User, profile: null | Profile, nickname: string) {
        if (profile === null) {
            throw new ApiException(
                'profile not found',
                404,
                'profile.changeNickname'
            );
        }

        if (profile.user_uid !== user.uid) {
            throw new ApiException(
                'profile not found',
                404,
                'profile.changeNickname'
            );
        }

        profile.nickname = nickname;

        const saved = await this.profileRepository.update(profile);
    }
}