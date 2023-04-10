import {FollowServiceImpl} from "../../../../src/domains/follow/service";
import {FollowRepositoryImpl} from "../../../../src/domains/follow/repository/follow.repository.impl";
import {db, NotFoundException} from "../../../../src/utils";
import {createUsersInDb} from "../../../../src/testPreparation";

let users: {username: string, email: string, password: string, id: string}[] = [];

beforeEach(async () => {
    //Delete all users
    await db.user.deleteMany({})

    users = await createUsersInDb(2);
});


describe("Test Follow Service", () => {
    const followService = new FollowServiceImpl(new FollowRepositoryImpl(db))

    test("GivenTwoUsers_WhenFollowUserIsCalled_ThenANewFollowShouldBeRegisterInTheDatabase", async () => {
        const user1 = users[0];
        const user2 = users[1];

        // User 1 follows user 2
        const result = await followService.FollowUser(user1.id, user2.id)

        // Search Follow registry in the db
        const dbCall = await db.follow.findFirst({where: {followerId: user1.id, followedId: user2.id}})

        expect(dbCall?.id).toBe(result.id);
    })

    test("GivenTwoUsers_WhenUnfollowUserIsCalled_ThenNoFollowBetweenThemShouldBeFoundInTheDatabase", async () => {
        const user1 = users[0];
        const user2 = users[1];

        // User 1 follows user 2
        await followService.FollowUser(user1.id, user2.id)

        // User 1 unfollows user 2
        await followService.UnfollowUser(user1.id, user2.id)

        // Search Follow registry in the db
        const dbCall = await db.follow.findFirst({where: {followerId: user1.id, followedId: user2.id}})

        expect(dbCall).toBe(null);
    })

    test("GivenAUser_WhenTryingFollowThemselves_ThenAnErrorShouldBeThrown", async () => {
        const user1 = users[0];

        // Make user1 follow himself
        await expect(async () => await followService.FollowUser(user1.id, user1.id)).rejects.toThrow(Error)
    })

    test("GivenAUserThatFollowsAnother_WhenTryingToFollowTheSameUserAgain_ThenAnErrorShouldBeThrown", async () => {
        const user1 = users[0];
        const user2 = users[1];

        // User 1 follows user 2
        await followService.FollowUser(user1.id, user2.id)

        // Try to follow again
        await expect(async () => await followService.FollowUser(user1.id, user2.id)).rejects.toThrow(Error)
    })

    test("GivenTwoUsersThatDoNotFollowEachOther_WhenTryingToUnfollow_ThenAnErrorShouldBeThrown", async () => {
        const user1 = users[0];
        const user2 = users[1];

        // Try to unfollow user 2
        await expect(async () => await followService.UnfollowUser(user1.id, user2.id)).rejects.toThrow(new NotFoundException('Follower'))
    })

    test("GivenTwoUsersThatFollowEachOther_WhenDeletingOneOfThem_ThenFollowRegistryShouldNotBeFoundInDb", async () => {
        const user1 = users[0];
        const user2 = users[1];

        // Make users follow each other
        await followService.FollowUser(user1.id, user2.id);
        await followService.FollowUser(user2.id, user1.id);

        // Delete user from db
        await db.user.delete({where: {id: user1.id}})

        // Find Follow registries where user 1 is follower or followed
        const result = await db.follow.findMany({where: {OR: {followerId: user1.id, followedId: user1.id}}})

        expect(result.length).toBe(0)
    })
})