const bcrypt = require('bcrypt');
const seed_userDAO = require('../../dao/user');
const jwt = require('jwt-simple');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries

  await knex('users_projects').del()
  const [user] = await knex('users')
  .where({username : "adamo"})

  console.log(user)  
  const user_id = user?.id;
  console.log(user?.id)  
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
    },
    {
      "name": "Test5",
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
