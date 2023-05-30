docker compose down
docker compose up --build -d

docker exec -it clickhouse-server clickhouse-client --query="CREATE TABLE queue (
    timestamp UInt64,
    level String,
    message String
  ) ENGINE = Kafka('kafka:9092', 'metrics', 'group1', 'JSONEachRow');"

docker exec -it clickhouse-server clickhouse-client --query="CREATE TABLE metrics (
    day Date,
    level String,
    total UInt64
  ) ENGINE = SummingMergeTree(day, (day, level), 8192);"

docker exec -it clickhouse-server clickhouse-client --query="CREATE MATERIALIZED VIEW consumer TO metrics
    AS SELECT toDate(toDateTime(timestamp)) AS day, level, count() as total
    FROM queue GROUP BY day, level;;
"

docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --create --if-not-exists --partitions 1 --replication-factor 1 --topic metrics
docker exec -it kafka sh -c "kafka-console-producer --broker-list localhost:9092 --topic metrics < topic_input"
