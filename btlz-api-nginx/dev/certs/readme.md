
https://nodeployfriday.com/posts/self-signed-cert/


Generate the certificate and private key using the config file you created above:

openssl req -new -nodes -x509 -days 365 -keyout domain.key -out domain.crt -config config

Verify the certificate has an IP SAN by running the following command:

openssl x509 -in domain.crt -noout -text


https://habr.com/ru/articles/352722/

Сначала сформируем закрытый ключ:
```
openssl genrsa -out rootCA.key 2048
```

Затем сам сертификат:
```
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
```
