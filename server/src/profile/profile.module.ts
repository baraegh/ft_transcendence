import { Module } from "@nestjs/common";
import { ProfileController, UploadsController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
    controllers:[ProfileController,UploadsController],
    providers:[ProfileService]
})
export class ProfileModule{

}