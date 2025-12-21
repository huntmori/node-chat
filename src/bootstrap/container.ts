import {container} from "tsyringe";
import {ConnectionManager} from "../WebSocket/ConnectionManager";
import {UserRepository} from "../repositories/UserRepository";
import {UserService} from "../services/UserService";
import {ProfileRepository} from "../repositories/ProfileRepository";
import {ProfileService} from "../services/ProfileService";

export default function()
{
    container.registerSingleton('ConnectionManager', ConnectionManager)
    container.registerSingleton('UserRepository', UserRepository);
    container.registerSingleton('UserService', UserService);
    container.registerSingleton('ProfileRepository', ProfileRepository);
    container.registerSingleton('ProfileService', ProfileService);
}
