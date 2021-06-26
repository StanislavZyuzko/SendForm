"use strict"
// проверка на то, что документ уже загружен
document.addEventListener('DOMContentLoaded', function () {
	// перехватывание отправки формы по нажатию кнопки
	// по ID все объекты form собираются
	const form = document.getElementById('form');
	// при отправке формы мы должны перейти в функцию  formSend
	form.addEventListener('submit', formSend);
	async function formSend(e) {
		// запрещаем стандартную отправку формы
		e.preventDefault();
		// валидация форм, начало
		let error = formValidate(form);
		// эта строка с помощью formData вытягивает все данные полей
		let formData = new FormData(form);
		// а здесь мы добавляем в эту переменную еще и изображение полученное функцией внизу
		formData.append('image', formImage.files[0]);
		// когда форма прошла валидацию и нет ошибок
		if (error === 0) {
			// отправка с помощью технологии AJAX с помощью fetch
			// класс _sending добавляется, чтобы сообщать пользователю о процессе отправки
			form.classList.add('_sending');
			// объявляем переменную response и в нее ждем отправки методом POST
			// данных formData которые мы вытянул в файл sendmail.php
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			// если отправка удачная
			if (response.ok) {
				// файл sendmail.php будет возвращать нам json ответ 
				let result = await response.json();
				// его мы будем выводить пользователю
				alert(result.message);
				// а также после отправки формы нам нужно очистить её
				// сначала див с изображением
				formPreview.innerHTML = '';
				// а также все поля форм
				form.reset();
				form.classList.remove('_sending');
			} else {
				// если что-то пошло не так
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		} else {
			// можно выводить попапы, делать что-то более сложное
			alert('Заполните обязательные поля');
		}

	}


	function formValidate(form) {
		let error = 0;
		// _req - дежурный класс, сокращенно от requred - обязательное поле
		let formReq = document.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
				// если это чекбокс и он не включен
			} else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
				formAddError(input);
				// увеличение переменной на 1
				error++;
			} else {
				// обычная проверка, заполнено ли поле вообще
				// если пустая '' тоже вешаем класс error
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		// значение будет либо 0, либо больше
		return error;
	}

	// объекту и родителю добавляется класс _error
	// родителю - тк сам объект скрыт
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}
	//Функция теста email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	//Получаем инпут file в переменную
	const formImage = document.getElementById('formImage');
	//Получаем див для превью в переменную
	const formPreview = document.getElementById('formPreview');

	//Слушаем изменения в инпуте file
	formImage.addEventListener('change', () => {
		// т.е когда будет срабатывать, то будем отправляться в функцию
		uploadFile(formImage.files[0]);
	});

	function uploadFile(file) {
		// проверяем тип файла
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			alert('Разрешены только изображения.');
			formImage.value = '';
			return;
		}
		// проверим размер файла (<2 Мб)
		if (file.size > 2 * 1024 * 1024) {
			alert('Файл должен быть менее 2 МБ.');
			return;
		}
		// функция превью
		// загрузка файла
		var reader = new FileReader();
		// когда файл успешно загружен
		reader.onload = function (e) {
			// формируем изображение, src которого - результат загрузки файла
			// и помещаем внутрь дива formPreview
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
		};
		// если что-то пойдет не так
		reader.onerror = function (e) {
			alert('Ошибка');
		};
		reader.readAsDataURL(file);
	}
});