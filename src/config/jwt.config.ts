import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

export const getJwtConfig = async (configService: ConfigService):
    Promise<JwtModule> =>
    ({ secret: configService.get("JWT_SECRET") })
