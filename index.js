var Cookies = function (config) {
	var self = this;
	
	//Формируем конфигурацию
	this.config = config || {};
	this.config.password = this.config.password || ''; ////Не шифруем

	//Шифрование текста
	this.encode = function (text, password) {
		if (! password) return text; //Без шифрования
		//Формируем ключ шифрования
		var n = Math.ceil(text.length / password.length);
		var secret_key = new Array(n + 1).join(password);
		//Кодируем строку
		var mask 	= '0000';
		var result = '';
		for (var i = 0; i < text.length; i++) {
			result += (mask + (text.charCodeAt(i) + secret_key.charCodeAt(i)).toString(16)).substr(-mask.length);
		};
		return result;
	};

	//Расшифрование текста
	this.decode = function (text, password) {
		if (! password) return text; //Без шифрования
		//Формируем ключ шифрования
		var n = Math.ceil(text.length/4/ password.length);
		var secret_key = new Array(n + 1).join(password);
		//Раскодируем строку
		var mask 	= '0000';
		var result 	= '';
		for (var i = 0; i < text.length/4; i++) {
			result +=  String.fromCharCode(parseInt(text.substr(i * mask.length, mask.length), 16) - secret_key.charCodeAt(i));
		};
		return result;
	};
	
	//Старт модуля
	this.start = function (req, res) {
		//Формируеи объект
		var result = {};
		//Значение до расшифровки
		result.headers	= req.headers.cookie;
		//Функция установки кукиса
		result.set		= function (name, value, time, path) {
			time = time==null ? 0 : Number(time);
			path = path==null ? '/' : path;
			//Считываем массив существующих в заголовке кукисов
			var cookies = res.getHeader ('Set-Cookie') || [];
			//Добавляем новый кукис
			cookies.push([
				self.encode(name + '', self.config.password) + '=' + self.encode(value + '', self.config.password),
				'path' + '=' + path,
				'expires' + '=' + (time ? (new Date(Date.now() + time*1000)).toGMTString() : 0),
			].join('; '));
			//Устанавливаем в заголовок обновленный массив кукисов
			res.setHeader('Set-Cookie', cookies);
		};
		//Функция удаления кукиса
		result.delete	= function (name) {
			this.set(name, '', -1);
		};
		//Значения расшифрованных кукисов
		result.parse = {};
		if (req.headers.cookie) {
			//Парсим
			var cookies = req.headers.cookie.replace(/\ +/g, '').split(';');
			for (var key in cookies) {
				//пара ключ-значение
				var key_value = cookies[key].split('=');
				if (key_value[0] && key_value[1]) {
					result.parse[this.decode(key_value[0], this.config.password)] = this.decode(key_value[1], this.config.password);
				};
			};
			//Менняем зашифрованное поле req.headers.cookie
			if (this.config.password) {
				var headers_cookie = [];
				for (var key in result.parse) {
					headers_cookie.push(key + '=' + result.parse[key]);
				};
				req.headers.cookie = headers_cookie.join('; ');
			}
		}
		return result;
	};
};
module.exports = function (config) {
	return new Cookies(config);
};