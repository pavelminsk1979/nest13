import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './domainUser';
import { UsersRepository } from './user.repository';
import { CreateUserInputModel } from './types';
import { DtoUser, ViewUser } from './classes';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ UsersService В ФАЙЛ app.module
 * providers: [AppService,UsersService]*/
export class UsersService {
  constructor(
    /* вот тут моделька инжектится
    именно декоратор  @InjectModel  определяет
    что происходит инжектирование
      -- (User.name)  регистрируется по имени
       также как в   app.module  в  imports
       и это будет скорей всего строка 'user'
       --<UserDocument> это тип умного обьекта
       ---userModel - это  свойство текущего класса ,
       это будет ТОЖЕ КЛАСС(это Моделька от mongoose).*/
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    protected usersRepository: UsersRepository,
  ) {}

  async createUser(createUserInputModel: CreateUserInputModel) {
    const passwordHash = createUserInputModel.password;

    const dto: DtoUser = new DtoUser(
      createUserInputModel.login,
      passwordHash,
      createUserInputModel.email,
    );

    /*    тут создаю нового юзера---использую МОДЕЛЬКУ ЮЗЕРА(это
        класс и при создании классу передаю данные в dto (это
        обьект с значениями которые нужны (согластно 
         СВАГЕРА) для зоздания нового юзера )) КЛАСС-МОДЕЛЬКА  ЭТО ЗАВИСИМОСТЬ -ПОЭТОМУ В НУТРИ МЕТОДА
         ОБРАЩЕНИЕ ИДЕТ ЧЕРЕЗ  this*/
    const newUser: UserDocument = new this.userModel(dto);
    const user = await this.usersRepository.createUser(newUser);

    /*  теперь надо создать структуру которую
      ожидает фронтенд (cогласно Swager)*/
    const viewUser: ViewUser = new ViewUser(
      user._id.toString(),
      user.login,
      user.email,
      user.createdAt,
    );

    return viewUser;
  }
}
