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
		{
			_id: 1,
			firstname: 'Vasya',
			lastname: 'Lol1',
			age: 0,
			email: 'vasya@mail',
		},
		{
			_id: 2,
			firstname: 'Petya',
			lastname: 'Lol2',
			age: 1,
			email: 'petya@mail',
		},
		{
			_id: 3,
			firstname: 'Sanya',
			lastname: 'Lol3',
			age: 2,
			email: 'sanya@mail',
		},
		{
			_id: 4,
			firstname: 'Kolya',
			lastname: 'Lol4',
			age: 3,
			email: 'kolya@mail',
		},
	]);
} catch (e) {
	print(e);
}
