export interface ITweetReturn extends Object {
  statuses: ITweet[]
}

export interface ITweet {
  id?: number
  id_str?: string
  user: IUser
}

interface IUser {
  screen_name: string
}
