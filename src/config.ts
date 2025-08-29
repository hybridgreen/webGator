import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string
}

function getConfigPath(): string{
    const homeDir = os.homedir();
    return path.join(homeDir, ".gatorconfig.json");
}

function fetchConfigString(): string{
    const configString = fs.readFileSync(getConfigPath(),{encoding: 'utf-8'});
    return configString;

}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig || typeof rawConfig !== 'object'){
        throw new Error('Invalid or missing config file')
    }
    if (!rawConfig.db_url || typeof rawConfig.db_url !== 'string'){
        throw new Error('Invalid or missing Database URL in config file')
    }
    if (rawConfig.current_user_name && typeof rawConfig.current_user_name !== 'string'){
        throw new Error('Invalid username in config file ');
    }
    const config: Config = {dbUrl : rawConfig.db_url, currentUserName : rawConfig.current_user_name}
    return config
}

export function setUser(username: string) {
    try{
        const obj = JSON.parse(fetchConfigString());
        obj['current_user_name'] = username;
        fs.writeFileSync(getConfigPath(), JSON.stringify(obj), {encoding: 'utf-8'})
    }
    catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
}

export function readConfig(): Config {
    const configString  = fetchConfigString();
    const imported = JSON.parse(configString);
    return validateConfig(imported);
}
