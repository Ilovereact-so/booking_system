const bcrypt = require('bcrypt');
const seed_userDAO = require('../../dao/user');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('oauth_access_tokens').del()
  const username = "adamo";
  const email = "adam@niga.com";
  const hashPassword = "Adam2115";
  await seed_userDAO.signupUser(username, email, hashPassword);
  secendUser()
  async function secendUser(){
    const username = "adamo2";
    const email = "adam2@niga.com";
    const hashPassword = "Adam22115";
    await seed_userDAO.signupUser(username, email, hashPassword);
  }
};
