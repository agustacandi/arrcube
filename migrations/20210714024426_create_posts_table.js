exports.up = function (knex) {
	return knex.schema.createTable('posts', function (table) {
		table.increments();
		table.string('title');
		table.text('content');
		table.string('author');
		table.string('name');
		table.text('imageUrl');
		table.boolean('admin');
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('posts');
};
