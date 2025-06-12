
exports.up = function(knex) {
  return knex.schema.createTable('appointments', function(table) {
    table.increments('id').primary(); // PRIMARY KEY, auto_increment
    table.integer('client_id').notNullable(); // brak foreign key na screenie
    table.datetime('appointment_date').notNullable();
    table.decimal('total_cost', 10, 2).nullable(); // total_cost może być NULL
    table.string('appointment_number', 255).collate('utf8mb4_general_ci').nullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('appointments');
};