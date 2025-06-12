
  exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments("id").primary();
      table.string("username").notNullable();
      table.string('email').notNullable().unique();
      table.string("password").notNullable()
      table.timestamps(true, true);
    });
  };
  
  
  exports.down = async knex => {
    await knex.schema.dropTableIfExists("users")
};