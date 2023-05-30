# Брокер сообщений Kafka как трасса данных

## Задание 1

Реализация перегонки данных из базы-источника (MongoDB) в целевую базу (MongoDB) с использованием Kafka и Kafka Connect. Реализация ничео из себя необычного представляет - устанавливается коннектор MongoDB для kafka-connect; читаем документацию и подготавливаем конфигурации для обоих коннекторов и запускаем.

- Файл docker-compose.yml описывает основные докер-контейнеры
- В sourceScripts и targetScripts содержаться скрипты для инициализации баз данных 
- Директория kafka-connect содержит: Dockerfile для устанавки коннектора для MongoDb, а также JSON конфигурацию для коннекторов
- В директории data хранится ключ для реплики
- run.sh и stop.sh - скрипты для запуска и остановки реализации.


docker-compose описывает следующие контейнеры:

  - mongoSource - контейнер базы-источника (внешний порт 27017)

  - mongoTarget - контейнер целевой базы (внешний порт 27017)

  - mongo-express-source - морда для базы-источника (внешний порт 8081)

  - mongo-express-target - морда для целевой базы (внешний порт 8082)

  - zookeeper (внутренний порт 2181, внешний порт 22181)

  - kafka (внутренний порт 9092, внешний порт 29092, имя хоста kafka)

  - schema-registry (внутренний порт 8082, внешний порт 8085, имя хоста schema-registry)

  - kafka-connect (внутренний порт 8083, внешний порт 8083, имя хоста kafka-connect)

Файл run.sh отвечает за запуск реализации, он должен быть исполняемым и должен быть запущен от имени суперюзера (нужно для установки требуемых прав на файл ключ в data). Необходимо подождать минуту (искусственное ожидание) т.к. для полного запуска образов требуется время, которое различается от машины к машине. 60 секунд должно хватать всегда.

Файл stop.sh отвечает за остановку реализации, он также должен быть исполняемым и также должен быть запущен от имени суперюзера.

## Задание 2

Берём за основу контейнеры из первого залания и добавляем к ним: worker и kafka-ui. Был написан собственный worker на JS (можно было использовать Schema Registry, однако по рассказам коллег это может быть оченб больно, поэтому было решено не испытывать судьбу).

Первая часть реализации работает также, как и в первом задании. Далее происходит следующее действо - Kafka-connect получается данные из базы-источника и публикует их в топике transer. в worker же подписывается на него. Когда сообщение опубликуется в топике, его получит worker и он будет заниматься конвертацией типов и проверками.

Файл run.sh отвечает за запуск реализации, он должен быть исполняемым и должен быть запущен от имени суперюзера (нужно для установки требуемых прав на файл ключ в data). Необходимо подождать минуту (искусственное ожидание) т.к. для полного запуска образов требуется время, которое различается от машины к машине. 60 секунд должно хватать всегда.

Файл stop.sh отвечает за остановку реализации, он также должен быть исполняемым и также должен быть запущен от имени суперюзера.

## Задание 3

Это задание полностью сделано по документации ClickHouse. В docker-compose описываются контейнеры: 
- kafka
- schema registry
- akhq
- clickhouseSrv (clickhouse-server на порту 8131)

В самом ClickHouse необходимо создать таблицы для данных из Kafka, таблицу для метрик (metrics) и представление для перегонки информации и таблицы данных в метрику.

Исходные данные для теста взяты из документации ClickHouse:

```json
{
	"timestamp": 1685467704,
	"level": "INFO",
	"message": "Hello"
}
```

Аналогичные таблицы созданы в clickHouse. Для просмотра результата:
``` sudo docker exec -it clickhouse-server clickhouse-client --query="SELECT \* FROM metrics;"```.
Сами же данные автоматически подтягиваются в таблицу ClickHouse после публикации в топике.

Файл run.sh отвечает за запуск реализации, он должен быть исполняемым и должен быть запущен от имени суперюзера. Необходимо подождать минуту (искусственное ожидание) т.к. для полного запуска образов требуется время, которое различается от машины к машине. 60 секунд должно хватать всегда.

Файл stop.sh отвечает за остановку реализации, он также должен быть исполняемым и также должен быть запущен от имени суперюзера.