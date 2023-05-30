const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

try {
	let main = async () => {
		const client = new MongoClient('mongodb://root:root@mongo-target:27017');

		const kafka = new Kafka({
			clientId: 'your-app',
			brokers: ['kafka:9092'],
		});

		const consumer = kafka.consumer({ groupId: 'test' });

		await client.connect();
		const db = client.db('test');
		const collection = db.collection('users');

		await consumer.connect();
		await consumer.subscribe({ topic: 'transfer', fromBeginning: true });

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				let data = JSON.parse(message.value?.toString());
				const insertRes = await collection.insertOne({
					_id: data._id.toString(),
					firstname: data.firstname,
					lastname: data.lastname,
					age: BigInt(data.age),
					email: data.email,
					sex: '',
				});
			},
		});
	};

	main();
} catch (e) {
	console.log(e);
}
