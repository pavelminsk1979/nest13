import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserInputModel, UserQueryParams, ViewUser } from './types';
import { UserQueryRepository } from './user.query-repository';

/*@Controller('users')--это эндпоинт-урл адрес на который 
будут приходить запросы*/
@Controller('users')
/* @Controller()-- декоратор,
 который применяется к классу , указывает,
 что этот класс является контроллером. Контроллеры в NestJS отвечают за
  обработку HTTP-запросов и определение маршрутов
  В аргументе   ('users')   это URL на который
  запросы придут и данный controller  их  обработает
  ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ UsersController В ФАЙЛ app.module
  controllers: [AppController, UsersController]*/
export class UsersController {
  /* Здесь используется механизм внедрения зависимостей.
    Когда экземпляр AppController создается, NestJS автоматически
   внедряет экземпляр AppService*/
  constructor(
    protected usersService: UsersService,
    protected userQueryRepository: UserQueryRepository,
  ) {}

  @Post()
  /* ИЗ БОДИ ВОЗМУ ПРИХОДЯЩИЕ ДАННЫЕ
  @Body() createUserInputModel---имя тут  createUserInputModel а
  в постмане когда запрос отправляю это обьект с
  данными*/
  async createUser(@Body() createUserInputModel: CreateUserInputModel) {
    const res: ViewUser =
      await this.usersService.createUser(createUserInputModel);
    return res;
  }

  @Get()
  async getUsers(@Query() queryParams: UserQueryParams) {
    const users = await this.userQueryRepository.getUsers(queryParams);
    return users;
  }
}
