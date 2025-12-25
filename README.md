### Задание по проекту карт РЭУ (ддл 25.12.25)

выполнили: Дымова Дарья (бэк + фронт), Воднева Анастасия (бд)

**Полноценная система управления студентами, курсами и расписанием**

##### Технологии:

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

##### Структура проекта

```
rea-maps-pair/
├── backend/ # TypeScript сервер
│ ├── src/
│ ├── server.ts # Основной сервер Express
│ └── prisma.ts # Prisma клиент и подключение к БД
├── frontend/ # Клиентская часть
│ └── index.html # Веб-интерфейс для тестирования API
├── prisma/ # Работа с базой данных (Настя)
│ ├── schema.prisma # Схема базы данных (сущности, связи)
│ └── migrations/ # Миграции базы данных
├── docker-compose.yml # Конфигурация Docker контейнеров
├── package.json # Зависимости и скрипты
├── tsconfig.json # Конфигурация TypeScript
└── .env # Переменные окружения
```

##### База данных (Prisma Schema)

1. Система включает 9 взаимосвязанных сущностей:
2. Пользователи (студенты, преподаватели, администраторы)
3. Группы студентов с кураторами
4. Кафедры и факультеты
5. Курсы и дисциплины
6. Расписание занятий с типами пар
7. Задания для студентов
8. Сдача работ с оценками
9. Учебные материалы

##### Эндпоинты

| Метод | Endpoint           | Описание                                                    | Обязательные поля                                        |
| ----- | ------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| GET   | `/api/users`       | Все пользователи (100 шт.) с группами, кафедрами и работами | -                                                        |
| POST  | `/api/users`       | Создать пользователя                                        | `email`, `passwordHash`, `firstName`, `lastName`, `role` |
| GET   | `/api/groups`      | Все группы со студентами, кураторами и расписанием          | -                                                        |
| POST  | `/api/groups`      | Создать группу                                              | `name`, `year`, `faculty`, `specialty`                   |
| GET   | `/api/courses`     | Все курсы с преподавателями и кафедрами                     | -                                                        |
| GET   | `/api/schedules`   | Всё расписание с курсами и группами                         | -                                                        |
| GET   | `/api/assignments` | Все задания с курсами и сданными работами                   | -                                                        |
| GET   | `/api/test`        | Проверка работы API (тестовый пользователь)                 | -                                                        |
