import {db} from '..';
import { Feed, feeds, users } from '../schema';
import { eq } from 'drizzle-orm';


export async function addFeed(name:string, url: string, user_id: string) {
     //console.log("Reached addFeed, about to insert:", name);

     try{
        const result = await db.insert(feeds).values({name: name, url: url, user_id:user_id}).returning();
        //console.log("Insert successful, result:", result);
        const [res] = result as any[];
        return res
     } catch (error){
        console.log("Error in addFeed:", error);
        throw error;
     }
}

export async function fetchFeed(url:string) {
    //console.log("Reached fetchFeed, about to fetch:", url);
    const[result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
} 

export async function fetchFeeds(){
    //console.log("Reached fetchFeed, about to fetch:", url);
    const result = await db.select().from(feeds);
    return result;
} 