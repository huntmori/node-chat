import {singleton} from "tsyringe";
import {BaseService} from "./BaseService";
import {ProfileRepository} from "../repositories/ProfileRepository";

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
}