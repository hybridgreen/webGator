import { type User } from 'src/lib/db/schema';
import {
    getFeed,
    createFeedFollow,
    getFeedFollowsForUser,
    getFeedbyID,
    deleteFeedFollow
} from "../lib/db/queries/feeds";
import { printFeed } from './feeds';


export async function followHandler(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0 || args[0].trim() === '') {
        throw new Error('Error. Please provide a URL.');
    }
    const url = args[0];

    const feed = await getFeed(url);

    const result = await createFeedFollow(feed.id, user.id);
    console.log('User', result.users.name,
        '\nNow following: ', printFeed(feed, result.users),
        '\nRecord:', result.feeds_follow);
}

export async function followingHandler(cmdName: string, user: User) {
    const follows = await getFeedFollowsForUser(user.id);
    const followList = [];
    for (const item of follows) {
        const feed = await getFeedbyID(item.feed_id);
        printFeed(feed, user);
    }
}

export async function unfollowHandler(cmdName: string, user: User, ...args: string[]) {
    const url = args[0];
    if (!url) {
        throw new Error('Error: No URL provided.');
    }
    const feed = await getFeed(url);
    const deleted = await deleteFeedFollow(user.id, feed.id);
    console.log('Unfollowed: ', (await getFeedbyID(deleted.feed_id)).name, 'for', user.name);
}