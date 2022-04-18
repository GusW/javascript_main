# Building bots with Node.js

## Setting up the project

- In your terminal, create directory `building-bots-reservation` and **change into it**.
- Run
  ```bash
  git clone --bare git@github.com:danielkhan/building-bots-reservation.git .git
  git config --bool core.bare false
  git reset --hard
  git branch
  ```
- With a branch you want to use checked out, run `npm install` and `npm run dev`
- This will run the application via nodemon and it will listen on `http://localhost:3000`

## NGROK

#### Exposing localhost to public

```bash
npm run dev
ngrok http 3000
```

## Slack

```bash
npm i @slack/events-api
npm i @slack/web-api
```

### Slack API UI (api.slack.com)

1. Create new app
   1. Name and Workspace
2. On App dashboard
   1. Navigate to `Oauth and Permissions`
   2. `Add an Oauth Scope` to `Bot Token Scopes`
      1. `chat:write`
   3. Navigate to `App Home`
      1. Check `Always show my Bot as online`
   4. Navigate to `Oauth and Permissions`
      1. Click to `Install App to Workspace`
      2. Copy `Bot user oauth token` and paste to .env **`SLACK_TOKEN`**
   5. Navigate to `Basic Information`
      1. Copy `Signing Secret` and paste to .env **`SLACK_SIGNING_SECRET`** key
   6. Navigate to `Event Subscriptions`
      1. Check slider
      2. Request URL: public route...`/bots/slack/events`
      3. `Add Bot user event`
         1. `app_mention`
         2. `message.im`
         3. `message.groups`
         4. `message.channels`

## WIT.AI

1. Create `New App`
2. `Train` app
3. Navigate to `Settings`
   1. Copy `Server Access Token` and paste into **`WIT_TOKEN`** .env key

```bash
npm i node-wit
```

## Alexa

1. developer.amazon.com
2. Alexa Skill Set
3. Create Skill
   1. `Custom`, `Node.js`, click `Create`
   2. `Start from scratch`, click `Create From Template`
4. On `Build` page:
   1. Menu `Intents > JSON Editor`
5. `Endpoints` menu
   1. `HTTPS > default`
   2. Copy/paste `<ngrok-endpoint>/bots/alexa`
   3. `...subdomain of a domain`

```bash
npm i ask-sdk-core ask-sdk-model
```
