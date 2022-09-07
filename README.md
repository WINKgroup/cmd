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

## API

### CmdStreamManagerNoConsoleLog
If you want to suppress output of stdout or stderr, but to keep consoleLog logic you can use this class:
```js
import { CmdStreamManagerNoConsoleLog } from '@winkgroup/cmd/build/streamManager'

const cmd = new Cmd('command', { args:['-v', 'pippo'] })
cmd.stderr = new CmdStreamManagerNoConsoleLog('stderr')

/***
should display:

Cmd: command -v pippo
Cmd: exit with code 1
*/
```
in this example we are suppressing stderr output, but not exit code error message


## Maintainers
* [fairsayan](https://github.com/fairsayan)