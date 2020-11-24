import Bot from './Bot'
Bot.run()
setInterval(() => {
  console.log('Tweeted')
  Bot.run()
}, 60000)
