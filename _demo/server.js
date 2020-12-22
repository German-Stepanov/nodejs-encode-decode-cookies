//Вспомогательная функция
Object.defineProperty(Object.prototype, 'myFormat', {writable: true, value:
	function() {
		var str = '' + JSON.stringify(this, null, 4);
		//TABS
		str = str.replace(/((?!\r\n)[\s\S]+?)($|(?:\r\n))/g, function (s, STR, CRLN, POS) {
			return STR.replace(/([^\t]*?)\t/g, function (s, STR, POS) {
				return STR + (new Array(4 - (STR.length + 4 ) % 4 + 1)).join(' ');
			}) + CRLN;
		});
		//LN
		str = str.replace(/\n/g, '<br/>');
		//SPACES
		return str.replace(/ +/g, function (s) {
			return (s.length==1) ? (' ') : ((new Array(s.length)).join('&nbsp;') + ' ');
		});
	}
});

//Устанавка конфигурации (глобальная)
myConfig = {};
//Конфигурация пользователя
myConfig.data = {
	port		: 2020,
	isDebug		: true,		//Сообшения сервера
};
//Конфигурация модуля кукисов
myConfig.cookies = {
	password 	: 'password',	//Пароль шифрования кукисов ('' - без шифрования)
};
var cookies = require('encode-decode-cookies')(myConfig.cookies);

//Формируем задачу
var app = function(req, res) {
	
	//Установим метку времени
	if (myConfig.data.isDebug) {
		console.log('\nПолучен запрос req.url', req.url);
		console.time('app');
	}
	//Подключаем и запускаем модуль кукисов
	req.cookies = cookies.start(req, res);
	
	var url = req.url.split('/');
	if (url[1]=='set') {
		//Установка
		var name = url[2];
		var value = url[3];
		var time = Number(url[4]);
		req.cookies.set( name, value, time, '/');
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		res.write('<div style="color:blue">Установлено "' + name + '" значение "' + value + '" на ' + (time==0 ? 'все время сессии' : time + ' секунд') + '</div>');
	} else if (url[1]=='del') {
		//Удаление
		var name = url[2];
		req.cookies.delete(name);
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		res.write('<div style="color:blue">Удалено "' + name + '"</div>');
	} else {
		//Просмотр
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		res.write('req.cookies.headers = "<b>' + req.cookies.headers + '</b>"');
		res.write('<br/><br/>');
		res.write('req.cookies.parse = ');
		res.write(req.cookies.parse.myFormat());
	}
	res.write('<style>* {font-size:18px} a {text-decoration:none; }</style>');
	res.write('<br/><br/>');
	res.write('<div><a href="/">Список значений</a></div>');
	res.write('<br/>');
	res.write('<div><a href="/set/user_id/17/15">Установить <b>user_id</b> значение <b>17</b> на <b>15 секунд</b></a></div>');
	res.write('<div><a href="/set/status/active/20">Установить <b>status</b> значение <b>active</b> на <b>20 секунд</b></a></div>');
	res.write('<div><a href="/set/session_name/ABCDEFGH/0">Установить <b>session_name</b> значение <b>ABCDEFGH</b> на <b>все время сессии</b></a></div>');
	res.write('<br/>');
	res.write('<div><a href="/del/user_id">Удалить <b>user_id</b></a></div>');
	res.write('<div><a href="/del/session_name">Удалить <b>session_name</b></a></div>');
	res.write('<div><a href="/del/status">Удалить <b>status</b></a></div>');
	res.end();
	
	//Выводим общее время
	if (myConfig.data.isDebug) {
		console.timeEnd('app');
	}
};
//Создаем и запускаем сервер для задачи
var server = require('http').createServer(app);
server.listen(myConfig.data.port);
//Отображаем информацию о старте сервера
if (myConfig.data.isDebug) console.log('Server start on port ' + myConfig.data.port + ' ...');
