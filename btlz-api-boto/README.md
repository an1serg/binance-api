### Перенос последних изменений git на сервер
Все действия выполняются от пользователя git 
 ```
 cd /var/boto
 git pull
 ```
- Сборка и запуск нового контейнера с изменениями
 ```
 docker compose -f btlz-api-boto/prod/compose.yaml up --build -d
 ```
 - Просмотр логов
 ```
 docker logs -f boto-api
```

### Для тестирования

```
curl -X POST https://btlz-api.ru/boto/api/binance/allOrders
```
