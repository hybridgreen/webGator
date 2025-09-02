import { db } from '..';
import { posts, type Feed } from '../schema';
import { inArray, sql } from 'drizzle-orm';
import { type RSSItem } from 'src/commands/utils'; 

export async function createPost(feed: Feed, post: RSSItem) {
    const publishedDate = String(new Date(post.pubDate));
    const [result] = await db.insert(posts)
        .values({
            url: post.link,
            title: post.title,
            feed_id: feed.id,
            published_at: publishedDate,
            description: post.description
        })
        .returning();
    return result;
}

export async function getPostsbyFeedid(feed_ids: string[], limit: number) {
    const result = await db.select()
        .from(posts)
        .where(inArray(posts.feed_id, feed_ids))
        .orderBy(sql`${posts.published_at} DESC`)
        .limit(limit);

    return result;
}

export async function getPostsUrls(){
    const urls = await db.select({url: posts.url}).from(posts);
    
    return urls.map((x) => x.url);
}