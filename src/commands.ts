

type CommandHandler = (cmdName : string, ...args: string[]) => Promise<void>
export type CommandsRegistry = Record<string,CommandHandler>

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    if(!(cmdName in registry)){
        registry[cmdName] = handler;
    }
    else{
        console.log(`Error Command:${cmdName} is already registered.`);
        process.exit(1);
    }
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    if(cmdName in registry){
        const handler = registry[cmdName];
        return await handler(cmdName, ...args);
    }
    else{
        console.log(`Error ${cmdName} does not exist as a valid command.`);
        process.exit(1);
    }
}



