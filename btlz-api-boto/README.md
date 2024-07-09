### Для пересборки и запуска  boto
```
 docker compose -f btlz-api-boto/prod/compose.yaml up --build
 ```

### Для пересборки и запуска nginx
```
docker compose -f btlz-api-nginx/dev/compose.yaml up --build
```

### Для тестирования

```
curl -k -X POST https://127.0.0.1:443/boto/api/binance/allOrders
```
