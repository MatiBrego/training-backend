import {db} from "./utils";

/**
 * Creates users and adds them to the db.
 * Each user created will have the following params:
 *      {username: Useri, email: "useri@gmail.com", password: i}
 *
 * Note: i will be a num between 0 and qty-1
 *
 * @param qty is the number of users to be created
 *
 * @return a list of users, with the specified params and their id in the db
 * */
export async function createUsersInDb(qty: number){
    const users = [];

    //Create users
    for (let i = 0; i < qty; i++) {
        const newUser = await db.user.create({
            data: {username: "user"+i, email: "user"+i+"@gmail.com", password: i.toString()}
        })

        users.push(newUser)
    }
    return users
}

/**
 * Creates a certain number of posts for each user.
 *
 * @param postQtyByUser The number of posts to be created by user
 *
 * @param userIds The ids of the users that will be authors of those posts
 *
 * @return A list with the posts created
 * */
export async function createPostsInDb(postQtyByUser: number, userIds: string[]){

    const posts = [];

    for (let i = 0; i < userIds.length; i++) {
        for (let j = 0; j < postQtyByUser; j++) {
            const newPost = await db.post.create({data: {content: "Post"+i, authorId: userIds[i]}})
            posts.push(newPost)
        }
    }
    return posts;
}