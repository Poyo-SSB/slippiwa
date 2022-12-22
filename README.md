# slippiwa

website which collects and displays ranks of washington melee players. built for vercel deployment with mongodb.

managing the database currently has no frontend and will require mongodb compass or a similar tool.

## environment variables (.env/vercel)

- `MONGODB_URI`: mongodb atlas should work fine
- `API_SECRET`: make sure it's secure!

- `QSTASH_CURRENT_SIGNING_KEY`: i use qstash to post to the /api/update endpoint every two hours
- `QSTASH_NEXT_SIGNING_KEY`: these are used to verify that a request is actually coming from qstash!

- `PUBLIC_CONTACT`: who do people contact when

## github secrets

- `API_SECRET`
- `API_UPDATE_URL`: the live endpoint to post to, for manual github actions

## mongo

create a cluster named "web" before running!