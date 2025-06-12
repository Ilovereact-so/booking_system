/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('oauth_access_tokens', (table) => {
        table.increments("id").primary();
        table.string('access_token').notNullable().unique();
        table.string("user_id").notNullable();
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTableIfExists("oauth_access_tokens")
};
