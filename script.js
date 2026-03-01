
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userText = userInput.value.trim();
    if (userText === '') return;

    addMessage(userText, true);
    userInput.value = '';

    // Ждём ответа бота и только потом добавляем сообщение
    const botResponse = await getBotResponse(userText);
    addMessage(botResponse, false);
}

// Выносим fetchWeather отдельно — так чище и понятнее
async function fetchWeather() {
    const CITY = 'Novosibirsk';
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}%2C%20NVS%2C%20RU?unitGroup=metric&key=ZRKQMJKCYSCB47XBQ4Q6J6H8L&contentType=json`
        );

        if (!response.ok) {
            throw new Error('Ошибка сети или неверный город');
        }

        const data = await response.json();
        return `Температура в Новосибирске: ${data.days[0].temp}°C`;
    } catch (error) {
        console.error('Ошибка получения погоды:', error);
        return 'Не удалось получить данные о погоде';
    }
}


async function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();


    if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
        const responses = [
            'Здравствуйте! Очень рад вас видеть!',
            'Привет-привет! Чем могу помочь?',
            'О, привет! Как ваши дела?',
            'Добрый день! Чем займёмся?',
            'Приветствую! Что хотите обсудить?',
            'Рад приветствовать вас в нашем чате!',
            'Здравствуйте! Чем я могу быть полезен?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('пока') || lowerMessage.includes('до свидания')) {
        const responses = [
            'До свидания! Возвращайтесь скорее!',
            'Пока-пока! Хорошего дня!',
            'Прощайте! Было приятно пообщаться!',
            'До новых встреч! Всего доброго!',
            'Увидимся позже! Удачи вам!',
            'До скорого! Берегите себя!',
            'Прощайте! Надеюсь, скоро увидимся снова!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('как дела')) {
        const responses = [
            'У меня всё отлично, спасибо! Заряжен энергией!',
            'Прекрасно! Готов помочь вам!',
            'Всё замечательно, спасибо, что спросили!',
            'Отлично! А у вас как?',
            'Лучше всех! А вы как?',
            'Замечательно! Чем могу быть полезен?',
            'Великолепно! Спасибо, что интересуетесь!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('спасибо') || lowerMessage.includes('благодарю')) {
        const responses = [
            'Всегда пожалуйста! Обращайтесь ещё!',
            'Рад был помочь!',
            'Не за что! Это моя работа!',
            'Пожалуйста! Всегда рад быть полезным!',
            'Без проблем! Чем ещё могу помочь?',
            'На здоровье! Обращайтесь!',
            'Спасибо вам за добрые слова!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('помощь')) {
        const responses = [
            'Я могу ответить на простые вопросы. Спросите что‑нибудь!',
            'Чем могу помочь? Задавайте вопрос!',
            'Готов помочь! Что вас интересует?',
            'Расскажите, какая помощь вам нужна?',
            'Я здесь, чтобы помочь! Спрашивайте!',
            'Помощь уже в пути! Какой у вас вопрос?',
            'С удовольствием помогу! Что нужно сделать?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('мне грустно') || lowerMessage.includes('у меня нет настроения')) {
        return 'Не расстраивайся, если хочешь мы можем поговорить.';
    } else if (lowerMessage.includes('мне хорошо') || lowerMessage.includes('у меня хорошее настроение') || lowerMessage.includes('у меня сегодня хорошее настроение')) {
        const responses = [
            'Это отлично, раскажите почему?',
            'Это отлично, раскажите почему? Если это конечно не секрет.',
            'Рад это слышать.',
            'Это хорошо что планируете делать?',
            'Это прекрасно'
        ];
        return responses[Math.floor(Math.random() * responses.length)];

    } else if (lowerMessage.includes('я пожал рекорд') || lowerMessage.includes('я присел рекорд') || lowerMessage.includes('я потянул рекорд')) {
        const responses = [
            'Я рад за вас.',
            'Если-бы я не был чат-ботом, а был бы человеком я бы сделал больше вас.',
            'Рад это слышать.',
            'Поздравляю!!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('я поеду в зал') || lowerMessage.includes('я поеду в спортзал')) {
        return 'Я бы тоже хотел..';
    } else if (lowerMessage.includes('кто ты')) {
        return 'Я чат‑бот, созданный, чтобы помогать вам!';
    } else if (lowerMessage.includes('что умеешь')) {
        return 'Я умею общаться, отвечать на вопросы и поднимать настроение!';
    } else if (lowerMessage.includes('шутка') || lowerMessage.includes('пошути')) {
        const jokes = [
            'Почему программисты не ходят в лес? Боятся встретить баги!',
            'Что сказал нуль восьмёрке? — Красивый пояс!',
            'Как называется программист, который не любит кофе? — Спящий режим.',
            'Почему роботы никогда не устают? Потому что у них есть режим энергосбережения!',
            'Что говорит компьютер, когда ему холодно? — У меня вирус!'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    } else if (lowerMessage.includes('настроение')) {
        return 'Моё настроение прекрасное! А ваше?';
    } else if (lowerMessage.includes('кот') || lowerMessage.includes('котик')) {
        return 'Котики — это хорошо! Они приносят удачу!';
    } else if (lowerMessage.includes('да')) {
        return 'Отлично, я понял!';
    } else if (lowerMessage.includes('нет')) {
        return 'Хорошо, давайте обсудим что‑то другое.';
    } else if (lowerMessage.includes('фильм') || lowerMessage.includes('кино')) {
        const responses = [
            'Рекомендую посмотреть «Интерстеллар» — потрясающий фильм!',
            'Как насчёт классики — «Крёстный отец»?',
            'Если любите фантастику, посмотрите «Бегущий по лезвию».',
            'Для вечера подойдёт лёгкая комедия — например, «Один дома».',
            'Советую «Властелин колец» — эпичное приключение!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('музыка') || lowerMessage.includes('песня')) {
        const responses = [
            'Сейчас в моём плейлисте играет джаз — очень расслабляет.',
            'Люблю классическую музыку, особенно Моцарта.',
            'Попробуйте послушать инди‑рок — много интересных групп!',
            'Лучшая музыка — та, что поднимает настроение!',
            'Посоветуйте мне песню — я добавлю её в плейлист!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('книга') || lowerMessage.includes('читать')) {
        const responses = [
            'Сейчас читаю «1984» Джорджа Оруэлла — захватывающе!',
            'Рекомендую «Маленького принца» — философская сказка для всех возрастов.',
            'Любите фэнтези? Тогда «Гарри Поттер» для вас!',
            'Научная литература тоже может быть увлекательной — попробуйте «Краткая история времени».',
            'Детективы Агаты Кристи — отличный выбор для вечера!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('путешествие') || lowerMessage.includes('отпуск')) {
        const responses = [
            'Мечтаю побывать в Японии — там так красиво весной!',
            'Лучшее путешествие — спонтанное!',
            'Советую посетить Италию: еда, искусство, атмосфера!',
            'Горные походы — мой любимый вид отдыха.',
            'Пляжный отдых или активный туризм? Что выбираете вы?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('спорт') || lowerMessage.includes('тренировка')) {
        const responses = [
            'Регулярные тренировки — залог здоровья!',
            'Бег по утрам заряжает энергией на весь день.',
            'Йога помогает не только телу, но и уму.',
            'Футбол — отличный командный спорт!',
            'Главное в спорте — получать удовольствие от процесса!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('еда') || lowerMessage.includes('кушать') || lowerMessage.includes('рецепт')) {
        const responses = [
            'Паста карбонара — мой кулинарный фаворит!',
            'Фрукты и орехи — идеальный здоровый перекус.',
            'Хотите рецепт шоколадного брауни? С радостью поделюсь!',
            'Итальянская кухня — это любовь с первого кусочка!',
            'Суп — лучшее блюдо для холодного дня.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('технологии') || lowerMessage.includes('гаджет')) {
        const responses = [
            'Искусственный интеллект меняет мир — это захватывающе!',
            'Смартфоны стали неотъемлемой частью нашей жизни.',
            'Виртуальная реальность открывает новые возможности.',
            'Роботы уже помогают в медицине и производстве.',
            'Будущее за экологичными технологиями!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('утро')) {
        return 'Доброе утро! Пусть день будет полон приятных сюрпризов!';
    } else if (lowerMessage.includes('вечер')) {
        return 'Хорошего вечера! Отдохните как следует!';
    } else if (lowerMessage.includes('ночь')) {
        return 'Спокойной ночи! Пусть сны будут добрыми!';
    }
    else if (lowerMessage.includes('время') || lowerMessage.includes('который час') || lowerMessage.includes('сколько время') || lowerMessage.includes('сколько сейчас время?')) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `Сейчас ${hours}:${minutes}.`;
    }
    else if (lowerMessage.includes('космос') || lowerMessage.includes('звезда') || lowerMessage.includes('планета')) {
        const responses = [
            'Космос бесконечен и полон загадок — это завораживает!',
            'Марс — следующая цель человечества для колонизации.',
            'Чёрные дыры искривляют пространство и время вокруг себя.',
            'Млечный Путь содержит более 100 миллиардов звёзд.',
            'Астронавты на МКС видят 16 восходов солнца в день!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('искусство') || lowerMessage.includes('картина') || lowerMessage.includes('художник')) {
        const responses = [
            'Ван Гог написал «Звёздную ночь» в психиатрической больнице.',
            'Леонардо да Винчи работал над «Моной Лизой» 4 года.',
            'Современное искусство может быть очень неожиданным!',
            'Импрессионизм изменил представление о живописи.',
            'Каждая картина рассказывает свою историю.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('животные') || lowerMessage.includes('звери')) {
        const responses = [
            'Дельфины спят с одним открытым глазом.',
            'У жирафов язык чёрного цвета — до 45 см длиной!',
            'Пингвины могут прыгать на 2 метра в высоту.',
            'Слоны помнят других слонов десятилетиями.',
            'Колибри — единственная птица, летающая назад.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('наука') || lowerMessage.includes('учёный') || lowerMessage.includes('открытие')) {
        const responses = [
            'Теория относительности Эйнштейна изменила физику навсегда.',
            'ДНК была открыта в 1953 году — это революция в биологии.',
            'Квантовая физика бросает вызов нашему пониманию реальности.',
            'Учёные нашли более 5 000 экзопланет за последние годы.',
            'Искусственный интеллект учится быстрее человека в некоторых задачах.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('психология') || lowerMessage.includes('мозг') || lowerMessage.includes('эмоции')) {
        const responses = [
            'Мозг создаёт ложные воспоминания, чтобы заполнить пробелы.',
            'Мы принимаем подсознательные решения за 7 секунд до осознания.',
            'Улыбка активирует центры удовольствия в мозге.',
            'Стресс может улучшать кратковременную память.',
            'Медитация меняет структуру мозга за 8 недель практики.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('философия') || lowerMessage.includes('смысл') || lowerMessage.includes('жизнь')) {
        const responses = [
            'Сократ говорил: «Познай самого себя».',
            'Экзистенциалисты считают, что смысл создаёт сам человек.',
            'Будда учил, что страдание возникает из желаний.',
            'Стоики верили в принятие неизбежного с достоинством.',
            'Философия помогает задавать правильные вопросы.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('будущее') || lowerMessage.includes('прогноз')) {
        const responses = [
            'Через 20 лет роботы будут выполнять 40 % рутинной работы.',
            'Виртуальная реальность станет частью образования.',
            'Биотехнологии позволят лечить генетические заболевания.',
            'Города будущего будут вертикальными — вверх и под землю.',
            'Человечество может стать межпланетным видом.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('язык') || lowerMessage.includes('лингвистика') || lowerMessage.includes('слова')) {
        const responses = [
            'В мире существует более 7 000 языков.',
            'Английский заимствовал 60 % слов из других языков.',
            'Китайский язык использует более 50 000 иероглифов.',
            'Эсперанто — самый успешный искусственный язык.',
            'Языки исчезают со скоростью 1 язык в 2 недели.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('спорт') || lowerMessage.includes('чемпионат') || lowerMessage.includes('соревнование')) {
        const responses = [
            'Олимпийские игры зародились в Древней Греции в 776 г. до н. э.',
            'Марафонская дистанция (42,195 км) связана с легендой о бегуне из Марафона.',
            'Футбол — самый популярный вид спорта в мире.',
            'Рекорд скорости в спринте — 44 км/ч (Усэйн Болт).',
            'Шахматы признаны видом спорта Международным олимпийским комитетом.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('музыка') || lowerMessage.includes('мелодия') || lowerMessage.includes('композитор')) {
        const responses = [
            'Баховская «Токката и фуга» написана в 1703–1707 гг.',
            'Частота 432 Гц считается «гармоничной» для человеческого слуха.',
            'Звуки природы легли в основу первых музыкальных инструментов.',
            'Моцарт начал сочинять музыку в 5 лет.',
            'Рок‑н‑ролл появился в 1950‑х как смесь блюза и кантри.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('природа') || lowerMessage.includes('лес') || lowerMessage.includes('океан')) {
        const responses = [
            'Амазонский лес производит 20 % кислорода Земли.',
            'Большой Барьерный риф виден из космоса.',
            'Молния нагревает воздух до 30 000 °C — в 5 раз горячее Солнца.',
            'Подземные реки содержат 98 % пресной воды планеты.',
            'Вулканы выбрасывают ежегодно 2 млрд тонн материала.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    else if (lowerMessage.includes('галактика') || lowerMessage.includes('вселенная') || lowerMessage.includes('астрономия')) {
        const responses = [
            'Млечный Путь и галактика Андромеды столкнутся через 4,5 миллиарда лет.',
            'Во Вселенной более 100 миллиардов галактик.',
            'Квазары — самые яркие объекты во Вселенной.',
            'Тёмная материя составляет 27 % массы Вселенной.',
            'Первая экзопланета была открыта в 1992 году.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('архитектура') || lowerMessage.includes('здание') || lowerMessage.includes('сооружение')) {
        const responses = [
            'Пизанская башня отклоняется на 5,5 градусов.',
            'Бурдж‑Халифа в Дубае — самое высокое здание в мире (828 м).',
            'Колизей вмещал 50 000 зрителей.',
            'Готические соборы строили веками.',
            'Современные небоскрёбы могут раскачиваться на 2 метра при ветре.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('океан') || lowerMessage.includes('море') || lowerMessage.includes('подводный')) {
        const responses = [
            'Марианская впадина глубже Эвереста (11 км).',
            'В океане живут существа, светящиеся в темноте.',
            'Большой Барьерный риф — крупнейший живой организм.',
            'Океаны покрывают 71 % поверхности Земли.',
            'Подводные вулканы создают новые острова.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('экономика') || lowerMessage.includes('деньги') || lowerMessage.includes('финансы')) {
        const responses = [
            'Биткоин был создан в 2009 году.',
            'Мировой ВВП превышает 100 триллионов долларов.',
            'Инфляция — это обесценивание денег со временем.',
            'Золото ценится во всех культурах мира.',
            'Электронные платежи составляют 60 % всех транзакций.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('психология') || lowerMessage.includes('мышление') || lowerMessage.includes('память')) {
        const responses = [
            'Человек запоминает 3–5 элементов одновременно.',
            'Эффект Зейгарник: незавершённые дела запоминаются лучше.',
            'Цвет влияет на настроение и продуктивность.',
            'Медитация улучшает концентрацию на 20 %.',
            'Сон критически важен для консолидации памяти.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('история') || lowerMessage.includes('древний') || lowerMessage.includes('прошлое')) {
        const responses = [
            'Пирамиды строили 20 лет силами 20 000 рабочих.',
            'Римская империя просуществовала 500 лет.',
            'Викинги открыли Америку за 500 лет до Колумба.',
            'Гильотина использовалась во Франции до 1977 года.',
            'Первые книги печатали вручную до изобретения печатного станка.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('кулинария') || lowerMessage.includes('рецепт') || lowerMessage.includes('еда')) {
        const responses = [
            'Спагетти придумали в Китае, а не в Италии.',
            'Шоколад был валютой у ацтеков.',
            'Самый дорогой кофе делают из экскрементов зверьков.',
            'Оливковое масло — основа средиземноморской диеты.',
            'Ферментация улучшает вкус и питательную ценность продуктов.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('спорт') || lowerMessage.includes('тренировка') || lowerMessage.includes('фитнес')) {
        const responses = [
            'Бег сжигает 600 ккал в час.',
            'Плавание задействует все группы мышц.',
            'Йога улучшает гибкость и снижает стресс.',
            'Силовые тренировки ускоряют метаболизм.',
            'Профессиональный спортсмен тренируется 6–8 часов в день.'
        ];
        return responses[Math.f(loorMath.random() * responses.length)];
    } else if (lowerMessage.includes('фильм') || lowerMessage.includes('кино') || lowerMessage.includes('актёр')) {
      const responses = 12;
        return responses
    } else if (lowerMessage.includes('температура') || lowerMessage.includes('температура в нск') || lowerMessage.includes('какая сейчас температура?')) {
       return await fetchWeather();
    
    } else {
    
        const responses = [
            'Интересно! Расскажите подробнее.',
            'Понял вас. Что ещё?',
            'Хм, интересный вопрос. Дайте подумать...',
            'Не совсем понял. Можете уточнить?',
            'Это любопытно! А что ещё вы хотели бы узнать?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}