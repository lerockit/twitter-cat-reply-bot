import Axios, { AxiosInstance } from 'axios'
import Twit, { Params } from 'twit'
import { ITweet, ITweetReturn } from './interfaces'

class Bot {
  private query: string
  private twitter: Twit
  private searchCount = 10
  private CAT_API_URL = 'https://api.thecatapi.com/v1/images/search'
  private catApi: AxiosInstance

  constructor() {
    this.query = process.env.SEARCH_QUERY || ''
    this.twitter = new Twit({
      consumer_key: process.env.CONSUMER_KEY || '',
      consumer_secret: process.env.CONSUMER_SECRET || '',
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    })
    this.catApi = Axios.create({
      baseURL: this.CAT_API_URL,
    })
  }

  private findTweets() {
    return new Promise<ITweet[]>(resolve => {
      this.twitter.get(
        'search/tweets',
        {
          q: `${this.query} -filter:retweets`,
          count: this.searchCount,
          lang: 'pt',
        },
        (error, data) => {
          if (error) throw new Error(error.message)
          const tweets = this.tweetsProvider(data as ITweetReturn)
          console.log(tweets)
          resolve(tweets)
        }
      )
    })
  }

  private replyTweet(params: Params) {
    this.twitter.post('/statuses/update', params)
  }

  private tweetsProvider(tweets: ITweetReturn): ITweet[] {
    return tweets.statuses.map(tweet => ({
      id_str: tweet.id_str,
      user: {
        screen_name: tweet.user.screen_name,
      },
    }))
  }

  private async getCatImageUrl(): Promise<string> {
    const { data } = await this.catApi.get('/')
    return data[0].url
  }

  private async getCatBase64Image(image_url: string): Promise<string> {
    const { data } = await Axios.get(image_url, { responseType: 'arraybuffer' })
    return Buffer.from(data, 'binary').toString('base64')
  }

  private storeImage(b64: string) {
    return new Promise<string>((resolve, reject) => {
      this.twitter.post(
        'media/upload',
        { media_data: b64 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err, data: any) => {
          if (err) return reject(err)
          const { media_id_string } = data
          return resolve(media_id_string)
        }
      )
    })
  }

  private async getCatImageId(): Promise<string> {
    const catImageUrl = await this.getCatImageUrl()
    const catBase64Image = await this.getCatBase64Image(catImageUrl)
    const catImageId = await this.storeImage(catBase64Image)
    return catImageId
  }

  private replyTweets(tweets: ITweet[]) {
    tweets.map(async tweet => {
      const catImageId = await this.getCatImageId()
      this.replyTweet({
        media_ids: [catImageId],
        status: `${process.env.MESSAGE} @${tweet.user.screen_name}`,
        in_reply_to_status_id: tweet.id_str,
        auto_populate_reply_metadata: true,
      })
    })
  }

  async run() {
    try {
      const tweets = await this.findTweets()
      this.replyTweets(tweets)
    } catch (e) {
      console.error('Error', e)
    }
  }
}

export default new Bot()
