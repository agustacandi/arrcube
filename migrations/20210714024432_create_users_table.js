exports.up = function (knex) {
	return knex.schema.createTable('users', function (table) {
		table.increments();
		table.string('name');
		table.string('username');
		table.string('email');
		table.string('password');
		table.text('imageUrl');
		table.boolean('admin').notNullable().defaultTo(false);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('users');
};
