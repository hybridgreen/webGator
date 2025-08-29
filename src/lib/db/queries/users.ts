import { error } from 'console';
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

export async function fetchUser(name:string) {
    //console.log("Reached fetchUser, about to fetch:", name);
    const[result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}   