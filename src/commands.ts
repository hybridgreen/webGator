import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";


type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export type CommandsRegistry = Record<string, CommandHandler>

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    if (!(cmdName in registry)) {
        registry[cmdName] = handler;
    }
    else {
        console.log(`Error Command:${cmdName} is already registered.`);
        process.exit(1);
    }
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (cmdName in registry) {
        const handler = registry[cmdName];
        return await handler(cmdName, ...args);
    }
    else {
        console.log(`Error ${cmdName} does not exist as a valid command.`);
        process.exit(1);
    }
}

export function userLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> =>  {
        if (!readConfig().currentUserName) {
            throw new Error('Error, no user logged in.')
        }
        const user = await getUser(readConfig().currentUserName);
        if (!user) {
            throw new Error('User not found.');
        }
        await handler(cmdName, user, ...args);
    }
}


