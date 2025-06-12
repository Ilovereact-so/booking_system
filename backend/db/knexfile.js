// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : 'localhost',
      port : 3306,
      database: 'erp',
      user: 'root',
      password: null,
      timezone: 'Z'
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'server_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  
  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST, //change
      port: 3306,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'server_migrations'
    },
    seeds: {
      directory: './seeds',
    },
  },
};
