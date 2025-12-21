import {container} from "tsyringe";
import {ConnectionManager} from "../WebSocket/ConnectionManager";
import {UserRepository} from "../repositories/UserRepository";
import {UserService} from "../services/UserService";
import {ProfileRepository} from "../repositories/ProfileRepository";
import {ProfileService} from "../services/ProfileService";

export default function()
{
    // 클래스 자체를 토큰으로 사용 (@singleton 데코레이터와 일관성 유지)
    container.registerSingleton(ConnectionManager);
    container.registerSingleton(UserRepository);
    container.registerSingleton(UserService);
    container.registerSingleton(ProfileRepository);
    container.registerSingleton(ProfileService);
}
