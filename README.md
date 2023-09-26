# Strapi + Liveblocks demo

![269924690-b02be364-8ea7-42a1-b813-ee14f94ce9e9](https://github.com/liveblocks/strapi-demo/assets/33033422/71e9d624-6e3d-4808-bbb9-512cb76698eb)

## Create environment variables

1. Create an account on [liveblocks.io](https://liveblocks.io/dashboard)
2. Copy your **secret** key from the
  [dashboard](https://liveblocks.io/dashboard/apikeys).
3. Create a new file, `nextjs-site/.env.local`, adding your secret key:
```bash
LIVEBLOCKS_SECRET_KEY="LIVEBLOCKS_SECRET_KEY_HERE"
STRAPI_BASE_URL=http://127.0.0.1:1337
```
4. Create a new file, `strapi-cms/.env` adding your secret key:
```bash
LIVEBLOCKS_SECRET_KEY="LIVEBLOCKS_SECRET_KEY_HERE"
HOST=0.0.0.0
PORT=1337
APP_KEYS=FBLOQQbo8bWnHZqJ95s9KA==,M99BYUU0exAe41Z9qsZSyA==,Kbk51gjo25+xicjl3fNCFQ==,uTOxT189fqv0m2EEmXyAyg==
API_TOKEN_SALT=XOJKLLsAjBt8k405Jq5E2g==
ADMIN_JWT_SECRET=AC6/KiiHjvdpuOvZUDh3Xw==
TRANSFER_TOKEN_SALT=7GCMWN4bygKLR1vdhUxbSw==
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
JWT_SECRET=Q5E1IK6k8DoKE12Slhgiaw==
```

## Install this project

1. Go to `strapi-cms/src/plugins/liveblocks-comments-plugin` and use `npm run install`, then `npm run build`.
2. Go to `strapi-cms` and use `npm run install`, then `npm run build`.
3. Go to `nextjs-site` and use `npm run install`.

## Run this project

1. Open `strapi-cms` and use `npm run develop -- watch-admin`. 
2. Open `nextjs-site` and use `npm run dev`.
3. Find the Strapi admin, with comments plugin, at [`http://localhost:8000`](http://localhost:8000).
4. Navigate to [`http://localhost:3000`](http://localhost:3000) to view the Next.js app.

Note that you'll get a `fetch` error the first time you run the Next.js project. To fix it, do this:

## First time signing in

1. After navigating to [`http://localhost:8000`](http://localhost:8000), sign up as a new user.
2. Enable the API by going to Settings → Users & Permissions Plugin → Roles → Public → Marketing-text, ticking `find` and `update`, then pressing Save.

[269922424-438ff596-485f-4916-a519-550a393c7e3e.webm](https://github.com/liveblocks/strapi-demo/assets/33033422/d256e5f3-cc20-425c-8c9f-1098fa84a425)

3. Go to the Content Manager and Publish your content.

[269924168-1716eb65-4a87-4873-86ad-5eafca4beb30.webm](https://github.com/liveblocks/strapi-demo/assets/33033422/147048f6-fe47-436e-93df-548f3bd1fe6d)


4. Refresh the Next.js project to see the data load correctly.

![269924690-b02be364-8ea7-42a1-b813-ee14f94ce9e9](https://github.com/liveblocks/strapi-demo/assets/33033422/71e9d624-6e3d-4808-bbb9-512cb76698eb)
