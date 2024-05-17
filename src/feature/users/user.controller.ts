import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserInputModel, UserQueryParams, ViewUser } from './types';
import { UserQueryRepository } from './user.query-repository';
import { Response } from 'express';
import { STATUS_CODE } from '../../common/constants-status-code';

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

  /*@Delete(':id')
  --тут id это uriПАРaМЕТР он в урле и из
    постмана запрос таким будет http://localhost:3000/users/66477c549c39ecbc48a29f70
    айдишку корректную прописывай иначе будет 500 ошибка */
  @Delete(':id')
  /*  @Param('id') userId: string---обязательно декоратор добавить
    который определит что это значение из ПАРАМЕТРА а положить значение  из параметра я могу в любую переменную-как
    хочу так и называю*/
  async deleteUserById(@Param('id') userId: string, @Res() response: Response) {
    const isDeleteUserById = await this.usersService.deleteUserById(userId);
    if (isDeleteUserById) {
      response.status(STATUS_CODE.NO_CONTENT_204).send();
    } else {
      response.status(STATUS_CODE.NOT_FOUND_404).send();
    }
  }
}