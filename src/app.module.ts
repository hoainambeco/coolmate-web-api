import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'mongodb',
      url: 'mongodb+srv://hoainambeco:01684490544Fe@cluster0.f6gva.mongodb.net/db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  ), AuthModule, UsersModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
