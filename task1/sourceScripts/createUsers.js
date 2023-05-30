let userName = process.env.MONGO_INITDB_ROOT_USERNAME;
let password = process.env.MONGO_INITDB_ROOT_PASSWORD;
let database = process.env.MONGO_INITDB_DATABASE;

console.log('Creating users and collections');
db.createUser({
	user: userName,
	pwd: password,
	roles: [
		{
			role: 'readWrite',
			db: database,
		},
		{
			role: 'dbOwner',
			db: database,
		},
	],
});

db.getSiblingDB(database).createCollection('users');
try {
	db.getSiblingDB(database).users.insertMany([
		{ firstname: 'Vasya', lastname: 'Lol1', age: 0, email: 'vasya@mail' },
		{ firstname: 'Petya', lastname: 'Lol2', age: 1, email: 'petya@mail' },
		{ firstname: 'Sanya', lastname: 'Lol3', age: 2, email: 'sanya@mail' },
	]);
} catch (e) {
	print(e);
}
