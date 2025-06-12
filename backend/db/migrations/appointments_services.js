exports.up = function(knex) {
  return knex.schema.createTable('appointments_services', function(table) {
    table.increments('id').primary(); // AUTO_INCREMENT PRIMARY KEY
    table.integer('appointment_id').unsigned().notNullable();
    table.integer('service_id').unsigned().notNullable();

    // Foreign key do appointments(id)
    table
      .foreign('appointment_id')
      .references('id')
      .inTable('appointments')
      .onDelete('CASCADE'); // lub RESTRICT / SET NULL — dostosuj według potrzeb
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('appointments_services');
};