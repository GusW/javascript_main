# React: Software Architecture

### `Software Architecture`

---

#### The study of the broader structure, organization and patterns of a development project - primarily the ones that impact developer productivity over time

---

### `Server-Side Rendering (SSR)`

---

#### When your server is the one that renders your React code to HTML instead of the user's browser

| Client-Side Rendering                     | Server-Side Rendering             |
| ----------------------------------------- | --------------------------------- |
| Renders app to HTML in the user's browser | Renders app to HTML on the server |
| Less strain on the server                 | More strain on server             |
| Generally slower user experience          | Faster UX and better for SEO      |
| 1. Loads index.html from server           | 1. Runs JS bundle                 |
| 2. Loads JS bundle from server            | 2. Loads data                     |
| 3. Runs bundle                            | 3. Creates HTML document          |
| 4. Displays app                           | 4. Sends to client side           |
| 5. Loads data                             | -                                 |

#### Code

```bash
# create React App
npx create-react-app 02_ssr
npm i react-router-dom

# create Server
npm i express
npm i @babel/core @babel/node @babel/preset-env @babel/preset-react nodemon -S
npm i styled-components
# run Server
npx babel-node server.js

# build React App (minified transpiled React code)
npm run build
# run Server with nodemon
npx nodemon --exec npx babel-node server.js
```

---

### `State Management Architecture`

---

#### How an application handles the data needs of its components, with regards to loading, storing, persisting and sharing this data

#### Technologies:

1. useState Hook
2. Context
3. Recoil
4. Redux
5. MobX

#### Tools depend on:

- The size and complexity of app
- How many components need to share that data
- Their unique strengths and weaknesses

#### Different Sizes of State

- Small
  - useState
  - Context
- Medium
  - Recoil
- Large
  - Redux
  - MobX

#### Code

```bash
# create React App
npx create-react-app 03_state_management
npm i recoil redux react-redux mobx
# react 18+ is not yet supported by mobx-react-lite
npm i --force mobx-react-lite
```
