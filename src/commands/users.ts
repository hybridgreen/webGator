
import { createUser, getUser, getUsers, getUserbyID } from 'src/lib/db/queries/users';
import { setUser, readConfig } from "../config";
import {getFeedFollowsForUser } from 'src/lib/db/queries/feeds';
import { getPostsbyFeedid } from 'src/lib/db/queries/posts';
import { type User } from 'src/lib/db/schema';

async function getPostsForUser(user: User, limit: number = 2) {
    const feedFollows = await getFeedFollowsForUser(user.id);
    if (!feedFollows) {
        console.log('User does not follow any feeds');
        return;
    }
    const followList = []
    for (const item of feedFollows) {
        followList.push(item.feed_id);
    }
    const posts = await getPostsbyFeedid(followList, limit);
        for(const post of posts){
            console.log(post.title);
        }
    }

export async function loginHandler(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        console.log('Invalid arguments, please provide a usernamme');
        process.exit(1);
    }
    if (args.length > 1) {
        console.log(`Extra arguments provided. Your username is ${args[0]}`);
    }
    if (!await getUser(args[0])) {
        throw new Error('User does not exist, please enter a valid user.')
    }
    setUser(args[0]);
    console.log(`User ${args[0]}, logged in successfully`);
}

export async function registerUserHandler(cmdName: string, ...args: string[]) {
    //console.log("Reached registerUserHandler");
    if (args.length === 0) {
        throw new Error('Invalid arguments, please provide a username');
    }
    const name = args[0]
    if (await getUser(name)) {
        throw new Error('User already exists');
    }
    else {
        //console.log('No user found. calling createUser');
        if (await createUser(name))
            console.log(`User ${name} created successfully`);
        setUser(name);

        //console.log(await getUser(name));
    }
}

export async function listHandler(cmdName: string) {
    const userNames = await getUsers();
    for (const obj of userNames[0]) {
        if (obj.name === readConfig().currentUserName) {
            console.log('*', obj.name, '(current)');
        }
        else {
            console.log('*', obj.name);
        }
    };
}

export async function browseHandler(cmdName: string, user: User, ...args: string[]) {
    const lim = Number(args[0]);
    if (lim) {
        //console.log(`reached ${cmdName}`);
        await getPostsForUser(user, lim);
    } else {
        console.log(`Warning: usage ${cmdName} <number>`);
        await getPostsForUser(user);
    }
}