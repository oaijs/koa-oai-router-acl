async function defaultBefore(ctx, next) {
  return undefined;
}

async function defaultAfter(ctx, next, allowed) {
  if (allowed) {
    await next();
    return;
  }

  ctx.throw(403, 'Your are forbidden.');
}

module.exports = {
  defaultBefore,
  defaultAfter,
};
