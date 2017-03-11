export default async (ctx, next) => {
  const title = 'Hello Koa2'

  await ctx.render('index', {
    title
  })
}
