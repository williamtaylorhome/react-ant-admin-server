# react-ant-admin Backend projects

This project uses[express](https://www.expressjs.com/)Quick onboarding of projects.

Before use, please install[nodejs](https://nodejs.org) environment,[mysql Database environment](https://www.mysql.com/)，[git Code management tools](https://git-scm.com/)。

## Install

- Install project dependencies

```shell
yarn install  / npm i
```

- Modify your own defined configuration

`token的secret encrypted string`

```js
// ${root}/common/jwt.js
const secret = "your secret";
```

`Project startup address, port`

```js
// ${root}/common/index.js
module.exports = {
  host: "0.0.0.0",
  port: 8081,
};
```

`Database address, username, password, database name`

```js
// ${root}/common/mysql.js
const pool = mysql.createPool({
  host: "127.0.0.1", // local
  user: "root",
  password: "your password",
  database: "react_admin", // Database name
  port: "3306",
  multipleStatements: true, // Allows multiple sql statements to be executed simultaneously
});
```

- Create a database named `react_admin`, use `utf8` for encoding, and use `utf8_general_ci` for encoding and sorting

There is a `react_admin.sql`sql backup file in the root directory. Just import the database you just created。

## start up

After completing the above operations, you can start the project.

```shell
npm run start
```

When the following statement appears, it means success!

```
  server is starting:
    http://listening address:port number
```

If you have any questions, please feel free to harass~