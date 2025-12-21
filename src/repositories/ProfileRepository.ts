import {singleton} from "tsyringe";
import {BaseRepository} from "./BaseRepository";

@singleton()
export class ProfileRepository extends BaseRepository
{
    constructor() {
        super("user_profiles");
        this.logger.info('ProfileRepository created');
    }
}