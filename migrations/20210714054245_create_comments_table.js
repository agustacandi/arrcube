exports.up = function (knex) {
	return knex.schema.createTable('comments', function (table) {
		table.increments();
		table.string('name');
		table.string('username');
		table.integer('postId');
		table.text('comment');
		table.boolean('admin');
		table.text('imageUrl');
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('comments');
};
