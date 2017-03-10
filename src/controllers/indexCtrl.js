export default async (ctx, next) => {
  const title = 'Hello title'

  await ctx.render('index', {
    title
  })
}
