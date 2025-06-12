const bcrypt = require('bcrypt');
const seed_userDAO = require('../../dao/user');
const jwt = require('jwt-simple');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const user_id = 16;
  const projects = [
    {
      "name": "Test1",
      "type": "Default", 
      "header":  2,
      "option1": 1,
      "option2": 4
    },
    {
      "name": "Test2",
      "type": "Default", 
      "header":  2,
      "option1": 1,
      "option2": 4
    },
    {
      "name": "Test3",
      "type": "Default", 
      "header":  2,
      "option1": 1,
      "option2": 4
    },
    {
      "name": "Test4",
      "type": "Default", 
      "header":  2,
      "option1": 1,
      "option2": 4
    }
  ];

  var secret = 'kurwakurwaKondzioCwelkurwakurwa';

  for(var i = 0; i < projects.length; i++ ){
    const project = jwt.encode(projects[i], secret, 'HS512');
    await knex('users_projects')
    .insert({user_id, project})
  }
 
}
