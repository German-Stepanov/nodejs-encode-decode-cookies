# nodejs-encode-decode-cookies
Простой модуль для взаимодействия с кукисами.
```
Позволяет добавлять, удалять и получать требуемые кукисы.
Позволяет устанвить простое шифрование кукисов.
```

## Подключение
```JS
var cookies = require('encode-decode-cookies')({
	password : 'password' 	//Пароль шифрования кукисов ('' - без шифрования)
});

//Формируем задачу
var app = function(req, res) {
	
	//Подключаем и запускаем модуль кукисов
	req.cookies = cookies.start(req, res);

	...
	
};
//Создаем и запускаем сервер для задачи
var server = require('http').createServer(app);
server.listen(2020);
```

## Использование

### Установка кукиса (до установки заголовков res.writeHead)
```JS
req.cookies.set( name, value, time, path || '/');
```

### Удаление кукиса (до установки заголовков res.writeHead)
```JS
req.cookies.delete( name );
```

### Получение всех кукисов
```JS
var my_cookies = req.cookies.parse;
```

### Получение отдельного кукиса
```JS
var user_id = req.cookies.parse['user_id'];
```

## Тестирование
```
Пример серверного кода для проверки работоспособности расположен в директории "_demo"
```
### Запуск тестового сервера (из папки "simple-cookies")
```
npm run demo
```
### Результат
```
http://localhost:2020
```
