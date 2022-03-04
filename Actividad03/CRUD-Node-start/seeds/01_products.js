/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    { name: 'T-800', description: 'Hasta la vista baby!', price: 100 },
    { name: 'T-850', description: 'A little better than T-800 mode.', price: 200 },
    { name: 'T-800', description: 'Exterminates all life on earth.', price: 300 }
  ]);
};
