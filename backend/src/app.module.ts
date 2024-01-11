import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { ChatModule } from './chat/chat.module';
import { UploadFileModule } from './upload-file/upload-file.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        UserModule,
        AuthModule,
        TwoFactorAuthModule,
        ChatModule,
        UploadFileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
