# strapi-demo

## Get environment variables

1. Create an account on [liveblocks.io](https://liveblocks.io/dashboard)
2. Copy your **secret** key from the
  [dashboard](https://liveblocks.io/dashboard/apikeys).
3. Create a new file, `nextjs-site/.env.local`and add your **secret** key as the
  `LIVEBLOCKS_SECRET_KEY` environment variable.
4. Add `STRAPI_BASE_URL=http://127.0.0.1:1337` to this file
5. Create a new file, `strapi-cms/.env`and add your **secret** key as the
  `LIVEBLOCKS_SECRET_KEY` environment variable.

## Install this project

1. Go to `strapi-cms/src/plugins/liveblocks-comments-plugin` and use `npm run install`, then `npm run build`.
2. Go to `strapi-cms` and use `npm run install`, then `npm run build`.
3. Go to `nextjs-site` and use `npm run install`.

## Run this project

1. Open `strapi-cms` and use `npm run develop -- watch-admin`. 
2. Open `nextjs-site` and use `npm run dev`.
3. Navigate to [`http://localhost:3000`](http://localhost:3000) to view the Next.js app.
4. Find the Strapi admin, with comments plugin, at [`http://localhost:8000`](http://localhost:8000).
