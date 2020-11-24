# 😸 Twitter Cat Bot
😸 Hi! This is my first Twitter bot. Using [CatAPI](https://thecatapi.com/) I wanna make the world, a place more like CATS.

![NYAN](https://media.giphy.com/media/7lsw8RenVcjCM/giphy.gif)

## What does this bot tweet?
This bot: 

 - Searchs for tweets (in 1 minute interval) containing the query coming from `SEARCH_QUERY` in the `.env` file (see .env.example)
 - Get some random cat image from the [CatAPI](https://thecatapi.com/) for each of those tweets
 - Reply each of thos tweets with the cat image and a message coming from `MESSAGE` in the `.env` file (see .env.example)

## Run and Cat
To run this project, after clone you may create a .env file in the project root passing your credentials from your app in [Developer Twitter Page](https://developer.twitter.com/)

After, you need to install all the packages:

    yarn

So, just run it local:

    yarn dev

## 😿 Deprecated 
😾 Seems like twitter don't like cats. Unfortunately, this approach break some [Twitter Rules](https://developer.twitter.com/en/developer-terms/policy). So, be carefull using it.