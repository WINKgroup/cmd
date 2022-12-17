# cmd
Helper library to manage long running shell commands

## Install
```
npm install @winkgroup/cmd
```

## Usage
```js
import Cmd from '@winkgroup/cmd'

async function go() {
    const ls = await Cmd.run('ls')
    console.log(ls)
    process.exit()
}

go()
```
this will run *ls* command on the shell and return the output in ls variable

you can check if a command exists using exists method:
```js
    ...
    const exists = Cmd.exists('ls')
    if (exists) console.log('mongo is a command')
        else console.error('command not found')
```

## Maintainers
* [fairsayan](https://github.com/fairsayan)