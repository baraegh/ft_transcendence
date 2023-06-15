import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy, RtStrategy } from "./strategy";
import { FortyTwoStrategy } from "./42_auth/strategy/42.strategy";

@Module({
    imports:[JwtModule.register({})],
    controllers : [AuthController],
    providers: [AuthService,JwtStrategy,RtStrategy,FortyTwoStrategy]
})
export class AuthModule{
    
}