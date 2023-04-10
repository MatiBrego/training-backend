import {PostServiceImpl} from "../../../../src/domains/post/service";
import {db} from "../../../../src/utils";
import {PostRepositoryImpl} from "../../../../src/domains/post/repository";
import {UserRepositoryImpl} from "../../../../src/domains/user/repository";
import {FollowRepositoryImpl} from "../../../../src/domains/follow/repository/follow.repository.impl";
import {createPostsInDb, createUsersInDb} from "../../../../src/testPreparation";

let users: {username: string, email: string, password: string, id: string}[] = [];

beforeAll(async () => {
   //Delete all users
   await db.user.deleteMany({})

   users = await createUsersInDb(4);
});

describe("Test Post Service", () => {
   const postService = new PostServiceImpl(
       new PostRepositoryImpl(db),
       new UserRepositoryImpl(db),
       new FollowRepositoryImpl(db))

   test("GivenFourUsersEachWithAPost_WhenJustCreated_ThenGetLatestPostShouldNotGetPrivateUserPost", async () => {
      const user1 = users[0];
      const posts = await createPostsInDb(1, users.map((user) => user.id));

      // Because of cursor pagination, the first post will be ignored
      const paginationArgs = {before: posts[0].id, limit: 10};

      // Get all posts
      let result = await postService.getLatestPosts(user1.id, paginationArgs)
      expect(result.length).toBe(3)
   })

   test("GivenFourUsersEachWithAPost_WhenOneUserGoesPrivate_ThenGetLatestPostShouldNotGetPrivateUserPost", async () =>{
      const user1 = users[0];
      const user2 = users[0];

      const posts = await createPostsInDb(1, users.map((user) => user.id));

      // Because of cursor pagination, the first post will be ignored
      const paginationArgs = {before: posts[0].id, limit: 10};

      // Make user2 private
      await db.user.update({where: {id: user2.id},data: {isPrivate: true}})

      // Get posts without the one that has a private author
      let result = await postService.getLatestPosts(user1.id, paginationArgs)

      expect(result.length).toBe(2)
      // Expect public posts not to have user2 as an author
      for (let i = 0; i < 2; i++) {
         expect(result[i].authorId).not.toBe(user2.id)
      }
   })

   test("GivenFourUsers_WhenOneUserGoesPrivateAndAnotherFollowsThem_ThenGetLatestPostsShouldGetAllPostsForUserThatFollows", async () => {
      const user2 = users[1];
      const user3 = users[2];

      db.post.deleteMany({})

      // Make user3 private
      await db.user.update({where: {id: user3.id},data: {isPrivate: true}})

      const posts = await createPostsInDb(1, users.map((user) => user.id));

      // Because of cursor pagination, the first post will be ignored
      const paginationArgs = {before: posts[0].id, limit: 10};

      // Make user2 follow user3
      await db.follow.create({data: {followerId: user2.id, followedId: user3.id}})

      // Get all posts, since private user3 is being followed by user2
      let result = await postService.getLatestPosts(user2.id, paginationArgs)

      expect(result.length).toBe(3);
   })
});

