import ConsoleLog, { ConsoleLogLevel } from "@winkgroup/console-log"
import Cmd from "../src"

async function go() {
    await Cmd.run('./tests/logEmitter.sh', {
        consoleLog: new ConsoleLog({ verbosity: ConsoleLogLevel.DEBUG }),
        stderrOptions: { logLevel: ConsoleLogLevel.DEBUG }
    })
    process.exit()
}

go()