import { LogLevel } from "@winkgroup/console-log"
import Cmd from "../src"

async function go() {
    await Cmd.run('./tests/logEmitter.sh', {
        consoleLogGeneralOptions: { verbosity: LogLevel.DEBUG },
        stderrOptions: { logLevel: LogLevel.DEBUG }
    })
    process.exit()
}

go()