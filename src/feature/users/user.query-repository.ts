import { Injectable } from '@nestjs/common';
import { UserQueryParams, ViewArrayUsers, ViewUser } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './domainUser';
import { Model } from 'mongoose';
import { DtoUser } from './classes';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * в providers: [AppServiceбUserQueryRepository]*/
export class UserQueryRepository {
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
  ) {}

  async getUsers(queryParams: UserQueryParams) {
    /*   в обьекте будут
       все поля для сортировки даже если
       их с фронтенда не передадут-будут установлены по умолчанию
       значения согластно свагеру*/
    const sort = {
      sortBy: queryParams.sortBy ?? 'createdAt',
      /* Оператор ?? выполняет проверку
     --если слева значением null или undefined тогда вернет
      то что справа
      ---если слева нормальное значение тогда вернет его */
      sortDirection: queryParams.sortDirection ?? 'desc',
      /*  ---Number(queryParams.pageNumber) пытается преобразовать значение  в числовой тип данных
       ---Если значение не может быть преобразовано в число, то результат будет NaN
       ----isNaN возвращает true, если переданное значение является NaN
       ---- присвою  значение 1    или если пришло число
       тогда присвою приходящее число (В ПАРАМЕТРАХ
       СТРОКИ ПОЭТОМУ Number() нужно*/
      pageNumber: isNaN(Number(queryParams.pageNumber))
        ? 1
        : Number(queryParams.pageNumber),

      pageSize: isNaN(Number(queryParams.pageSize))
        ? 10
        : Number(queryParams.pageSize),
      searchLoginTerm: queryParams.searchLoginTerm ?? null,
      searchEmailTerm: queryParams.searchEmailTerm ?? null,
    };
    /* при указании направления сортировки в методе sort(), 
       принимаются только значения 1 и -1.*/
    const sortDirectionValue = sort.sortDirection === 'asc' ? 1 : -1;
    /*Создается переменная filter
      это обьект в которос свойство с ключом $or
       значение которое под этим ключом это массив а в масиве
       каждый элемент это обьект
       --Переменная filter используется для создания фильтра запроса в базу данных MongoDB
       --Свойство $or в MongoDB позволяет указывать несколько условий для поиска, при которых хотя бы одно из условий должно выполняться
       ---Изначально, filter.$or инициализируется пустым массивом, чтобы затем добавить в него объекты с условиями поиска. Каждый объект в массиве $or представляет отдельное условие поиска.
       ---В коде, условия поиска добавляются в массив filter.$or с помощью метода push()
       */
    const filter: { $or: object[] } = { $or: [] };

    /* если sort.searchLoginTerm  существует 
    тогда добавится в filter
    обьект с ключом login
    а у него будут свойства 
    для поиска
     ---оператор $regex для выполнения поиска по полю login с использованием регулярного выражения. Значение searchLoginTerm используется в качестве шаблона для поиска.
      ---Опция $options: 'i' указывает на регистронезависимый поиск (игнорирование регистра букв)*/

    if (sort.searchLoginTerm) {
      filter.$or.push({
        login: {
          $regex: sort.searchLoginTerm,
          $options: 'i',
        },
      });
    }

    if (sort.searchEmailTerm) {
      filter.$or.push({
        login: {
          $regex: sort.searchEmailTerm,
          $options: 'i',
        },
      });
    }
    /* filter.$or.length ? filter : {}
    эту проверку нужно написать
    иначе если будет filter.$or.length равен нулю тогда
     filter  не пустой обьект  ИБО ПРИ СТАРТЕ 
     let filter: { $or: object[] } = { $or: [] };
     А НАДО ЧТОБ ПУСТОЙ ТОГДА ОБЬЕКТ БЫЛ*/
    const users: UserDocument[] = await this.userModel
      .find(filter.$or.length ? filter : {})
      /*  sort({ [sort.sortBy]: sortDirectionValue })
        Результаты запроса сортируются по полю,
         указанному в переменной sort.sortBy, и
         используется значение sortDirectionValue
          для определения направления сортировки
           (1 для по возрастанию, -1 для по убыванию).*/
      .sort({ [sort.sortBy]: sortDirectionValue })
      /*   skip((sort.pageNumber - 1) * sort.pageSize)
         Пропускаются результаты запроса, чтобы получить страницу с номером sort.pageNumber. Формула
          (sort.pageNumber - 1) * sort.pageSize определяет количество документов, которые нужно пропустить.*/
      .skip((sort.pageNumber - 1) * sort.pageSize)
      /*   .limit(pageSize)
    Ограничивается количество результатов запроса до значения sort.pageSize, чтобы получить определенный размер страницы.*/
      .limit(sort.pageSize)
      /*.exec()
    Выполняется запрос к базе данных и возвращается результат*/
      .exec();
    /*  totalCount  это число- количество документов
    по данному фильтру 
     Выполняется запрос с помощью  модельки  и  с использованием метода countDocuments*/
    const totalCount: number = await this.userModel.countDocuments(
      filter.$or.length ? filter : {},
    );

    /*
pagesCount это число
Вычисляется общее количество страниц путем деления общего количества документов на размер страницы (pageSize), и округление вверх с помощью функции Math.ceil.*/

    const pagesCount: number = Math.ceil(totalCount / sort.pageSize);

    const arrayUsers: ViewUser[] = users.map((user: UserDocument) => {
      return DtoUser.getViewModel(user);
    });
    /* создаю обьект который ожидают на фронте
    в нем будут полля определяющие
    страницу и количество страниц
    и список МАСИВ документов из базы данных
    но масив я еще отмаплю чтоб привести его к виду
    который соответствует свагеру*/
    const viewUsers: ViewArrayUsers = {
      pagesCount,
      page: sort.pageNumber,
      pageSize: sort.pageSize,
      totalCount,
      items: arrayUsers,
    };
    return viewUsers;
  }
}
