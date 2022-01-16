```
$ mkdir restaurant-reviews && cd "$_"
$ mkdir backend && cd "$_"
$ npm init -y
$ npm install express cors mongodb dotenv
$ npm install -g eslint nodemon
$ npm install --save-dev nodemon
# addons: validation, req/res logging
$ npm i --save ajv morgan
```

add row to `/restaurant-reviews/backend/package.json`:

```
type: "module",
```

create `.env` file on root `backend` folder:

```
RESTREVIEWS_DB_URI=mongodb+srv://gusw:<password>@cluster0.3mdpu.mongodb.net/samples_restaurant?retryWrites=true&w=majority
RESTREVIEWS_NS=sample_restaurants
PORT=5000
```

create `frontend` folder and initial React project:

```
# on project root folder
$ npx create-react-app frontend
$ npm install bootstrap react-router-dom axios react-router
```
