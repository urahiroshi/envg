# envg

Configure environment variables with Node.js

### Getting started

1. `npm i envg`
2. prepare `env/example.js` file like that

```js
module.exports = {
  HOGE: 'hogehoge',
  FUGA: 'fugafuga',
  NODE_ENV: 'example',
};
```

3. Configure npm-scripts of your `package.json` like that

```json
"scripts": {
  "start": "envg example <your_command>"
}
```

4. You can use environment variables defined by `env/example.js` in any your command!

```sh
# with process.env
$ npx envg example node -e "console.log(process.env.HOGE)"
>> hogehoge

# with reuire('envg')
$ cat print.js
const { env } = require('envg');
cnosole.log(env.HOGE);

$ npx envg example node print.js
>> hogehoge

# with non-js file
$ cat print.sh
echo $HOGE

$ npx envg sh print.sh
>> hogehoge
```

### Advanced usage

#### Overwrite environment variable

`env/<env_name>.js` file can be overwritten by environment variable,
these values works as default.
For example, if you have such a `env/example.js` file:

```js
module.exports = {
  HOGE: 'hogehoge',
  FUGA: 'fugafuga',
  NODE_ENV: 'example',
};
```

You can overwrite these environment keys (`HOGE`, `FUGA`, `NODE_ENV`):
```sh
$ npx envg example node -e "console.log(process.env.HOGE)"
>> hogehoge

$ HOGE=overwritten npx envg example node -e "console.log(process.env.HOGE)"
>> overwritten
```

You don't need to write `HOGE: process.env.HOGE || 'hogehoge'` or something in env file.

#### Define environment variable with non-default value

You may require environment variable which has non-default value but used in application.
For example, you have secret token which is passed in environment variable, but not exposed in source code.

In that case, you can configure such a variable with `undefined` value, like that (`env/secret.js`):

```js
module.exports = {
  SECRET_VALUE: undefined,
};
```

This `SECRET_VALUE` should be passed as environment variable, otherwise envg will be failed for preventing your command runs with non `SECRET_VALUE` value. You don't require your own validation logic for `process.env.SECRET_VALUE` in that case.

```sh
# it will be failed before `npm start`
$ npx envg secret npm start

# it will work well
$ SECRET_VALUE=XXX npx envg secret npm start
```
