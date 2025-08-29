import { error } from "console";
import { setUser, readConfig } from "./config";
import {createUser, fetchUser, resetDB, getUsers} from 'src/lib/db/queries/users'
import { read } from "fs";

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


export async function loginHandler (cmdName: string, ...args: string[]){
    if (args.length === 0){
        console.log('Invalid arguments, please provide a usernamme');
        process.exit(1);
    }
    if (args.length > 1 ){
        console.log(`Extra arguments provided. Your username is ${args[0]}`);
    }
    if(!await fetchUser(args[0])){
        throw new Error('User does not exist, please enter a valid user.')
    }
    setUser(args[0]);
    console.log(`User ${args[0]}, logged in successfully`);
}

export async function registerUserHandler(cmdName:string, ...args: string[]) {
    //console.log("Reached registerUserHandler");
    if (args.length === 0){
        throw new Error('Invalid arguments, please provide a username');
    }
    const name = args[0]
    if(await fetchUser(name)){
        throw new Error('User already exists');
    }
    else{
        //console.log('No user found. calling createUser');
        await createUser(name);
        setUser(name);
        console.log(`User ${name} created successfully`);
        console.log(await fetchUser(name));
    }
}

export async function resetHandler(cmdName:string) {
    console.log('Resetting database');
    await resetDB();
}
export async function listHandler(cmdName:string) {
    const userNames = await getUsers();
    for (const obj of userNames[0]){
        if(obj.name === readConfig().currentUserName){
            console.log('*',obj.name, '(current)');
        }
        else{
            console.log('*',obj.name);
        }

    };
}
