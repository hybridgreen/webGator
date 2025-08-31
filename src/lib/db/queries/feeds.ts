import {db} from '..';
import { type Feed, feeds, feeds_follow, users } from '../schema';
import { and, eq } from 'drizzle-orm';


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

export async function getFeed(url:string) {
    //console.log("Reached fetchFeed, about to fetch:", url);
    const[result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getFeedbyID(feed_id:string) {
    //console.log("Reached fetchFeed, about to fetch:", url);
    const[result] = await db.select().from(feeds).where(eq(feeds.id, feed_id));
    return result;
} 

export async function getFeeds(){
    //console.log("Reached fetchFeeds");
    const result = await db.select().from(feeds);
    return result;
} 

export async function createFeedFollow(feed_id:string, user_id: string) {
    //console.log("Reached createFeedFollow, about to insert:", url);
    const[newFeedFollow] = await db.insert(feeds_follow).values({feed_id: feed_id, user_id: user_id}).returning();
    const [allRecords] = await db.select()
        .from(feeds_follow)
        .innerJoin(users, eq(users.id, feeds_follow.user_id))
        .innerJoin(feeds,eq(feeds_follow.feed_id, feeds.id));
    return allRecords;
}

export async function getFeedFollowsForUser(user_id:string) {
    //console.log("Reached getFeedFollowsForUser, fetching feed for:", user_id);
    const feedFollows = await db.select()
        .from(feeds_follow)
        .where(eq(feeds_follow.user_id,user_id))
    //console.log('Query returned with: ', feedFollows);
    return feedFollows;
}

export async function deleteFeedFollow(user_id :string, feed_id:string) {
    //console.log("Reached deleteFeedFollow");
    const [deleted] = await db.delete(feeds_follow).where(and(eq(feeds_follow.user_id, user_id), eq(feeds_follow.feed_id , feed_id))).returning();
    return deleted;
}
