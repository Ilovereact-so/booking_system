
  exports.up = function (knex) {
    return knex.schema.createTable('users_projects', (table) => {
      table.increments("id").primary();
      table.string("user_id").notNullable();
      table.string('project').notNullable();
      table.timestamps(true, true);
    });
  };
  
  
  exports.down = async knex => {
    await knex.schema.dropTableIfExists("users_projects")
};