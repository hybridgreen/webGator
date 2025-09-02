import { getUserbyID } from "src/lib/db/queries/users";
import { type Feed, type User } from 'src/lib/db/schema';
import {
    addFeed,
    getFeeds,
    createFeedFollow,
} from "../lib/db/queries/feeds";

export function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.created_at}`);
    console.log(`* Updated:       ${feed.updated_at}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* Created by:    ${user.name}`);
}

export async function feedsHandler(cmdName: string) {

    const feeds = await getFeeds();
    //console.log('[Debug]','Feed: ',feeds);

    for (const item of feeds) {
        //console.log(item.name, item.user_id);
        const user = await getUserbyID(item.user_id);
        //console.log('Fetched user:', user);
    }

}

export async function addFeedHandler(cmdName: string, user: User, ...args: string[]) {
    const name = args[0];
    if (!name || name.trim() === '') {
        throw new Error('Error adding Feed. Please provide a username');
    }
    const url = args[1];
    if (!url || url.trim() === '') {
        throw new Error('Error adding Feed. Please provide a URL.');
    }

    const feed = await addFeed(name, url, user.id);
    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log('User', feedFollow.users.name,
        '\nNow following: ', feedFollow.feeds.name,
        '\nRecord:', feedFollow.feeds_follow);
}