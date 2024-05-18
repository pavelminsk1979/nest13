import { Injectable } from '@nestjs/common';
import { UserDocument } from '../domains/domain-user';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ UsersRepository В ФАЙЛ app.module
 * providers: [AppService,UsersService,UsersRepository]*/
export class UsersRepository {
  async createUser(newUser: UserDocument) {
    return newUser.save();
  }
}
