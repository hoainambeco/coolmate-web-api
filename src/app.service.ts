import {Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users/entities/user.entity";
import {MongoRepository, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "./shared/service/config.service";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
    }

    getLogin(req, res) {
        console.log(req.body)
        return {
            message: 'Hello World!',
        };
    }

    async postLogin(req, res) {
        const user = await this.userRepository.findOneBy({email: req.body.email});
        if (!user) {
            return res.render('./login', {
                msg: '<div class="alert alert-danger" role="alert">\n' +
                    'Không tìm thấy user' +
                    '</div>',
            });
        }
        if (user && (await bcrypt.compare(req.body.password, user.password))) {
            const payload = {username: user.email, sub: user.id};
            const access_token = await this.jwtService.signAsync({id: user.id}, {secret: this.configService.get('JWT_SECRET_KEY')})
            req.session.user ={...user , access_token: access_token}
            console.log(req.session)
            res.redirect('/product');
        } else {
            return res.render('./login', {
                msg: '<div class="alert alert-danger" role="alert">\n' +
                    'Sai mat khau' +
                    '</div>',
            });
        }

    }

    getHello() {
        return {
            message: 'Hello World!',
        };
    }
    getProduct(req,res) {
        return {
            message: 'Hello World!',
        };
    }

}
