
import { UUID } from 'crypto';
import {db} from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';


export async function createUser(name: string){
    //console.log("Reached createUser, about to insert:", name);
    
    try {
        const result = await db.insert(users).values({name: name}).returning();
        //console.log("Insert successful, result:", result);
        const [firstResult] = result as any[];
        return firstResult;
    } catch (error) {
        console.log("Error in createUser:", error);
        throw error;
    }
}

export async function getUser(name:string) {
    //console.log("Reached fetchUser, about to fetch:", name);
    const[result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}  

export async function resetDB() {
    try{
        const result = await db.delete(users);
        return [result];
    }
    catch(error){
        console.log("Error in resetDB:", error);
        throw error;
    }
}

export async function getUsers() {
    try{
        const result = await db.select({name: users.name}).from(users);
        return [result];
    }
    catch(error){
        console.log("Error in getUsers:", error);
        throw error;
    }
}

export async function getUserbyID(user_id:string) {
    const [result] = await db.select().from(users).where(eq(users.id, user_id));
    return result;
}