
async function findPets(ctx, next) {
  ctx.response.body = 'find success';
}

module.exports = {
  findPets,
};
