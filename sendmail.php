<?php
// подключение файлов из папки PHPMailer
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	// объявление плагина
	$mail = new PHPMailer(true);
	// настройка кодировки, иначе будут каракули
	$mail->CharSet = 'UTF-8';
	// языковой файл из папки phpmailer, чтобы ошибки выводились на понятном языке
	$mail->setLanguage('ru', 'phpmailer/language/');
	// включение возможности HTML-тегов в письме 
	$mail->IsHTML(true);

	//От кого письмо емейл и имя
	$mail->setFrom('указать!', 'Фрилансер по жизни');
	//Кому отправить (один или несколько адресатов)
	$mail->addAddress('указать!');
	//Тема письма
	$mail->Subject = 'Привет! Это "Фрилансер по жизни"';

	//Рука
	$hand = "Правая";
	if($_POST['hand'] == "left"){
		$hand = "Левая";
	}

	//Тело письма
	$body = '<h1>Встречайте супер письмо!</h1>';
	
	// проверка - если тело не пустое
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['hand']))){
		$body.='<p><strong>Рука:</strong> '.$hand.'</p>';
	}
	if(trim(!empty($_POST['age']))){
		$body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
	}
	
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
	}
	
	//Прикрепить файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//путь загрузки файла
		$filePath = __DIR__ . "/files/" . $_FILES['image']['name']; 
		//грузим файл если удалось - добавляем надпись
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			$body.='<p><strong>Фото в приложении</strong>';
			// В плагин добавляется файл, который будет прикреплен к письму
			$mail->addAttachment($fileAttach);
		}
	}
	// собранная переменная $body отправляется в плагин
	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'Ошибка';
	} else {
		$message = 'Данные отправлены!';
	}
	// формируется простой JSON message 
	$response = ['message' => $message];
	// и с заголовком json возвращаем в JS обратно 
	header('Content-type: application/json');
	echo json_encode($response);
?>