import {FollowServiceImpl} from "../../../../src/domains/follow/service";
import {FollowRepositoryImpl} from "../../../../src/domains/follow/repository/follow.repository.impl";
import {db} from "../../../../src/utils";
import {createUsersInDb} from "../../../../src/testPreparation";

let users: {username: string, email: string, password: string, id: string}[] = [];

beforeAll(async () => {
    //Delete all users
    await db.user.deleteMany({})

    users = await createUsersInDb(2);
});


describe("Test Follow Service", () => {
    const followService = new FollowServiceImpl(new FollowRepositoryImpl(db))

    test("GivenTwoUsers_WhenFollowUserIsCalled_ThenANewFollowShouldBeRegisterInTheDatabase", async () => {
        const user1 = users[0];
        const user2 = users[1];

        const result = await followService.FollowUser(user1.id, user2.id)
        const dbCall = await db.follow.findFirst({where: {followerId: user1.id, followedId: user2.id}})

        expect(dbCall?.id).toBe(result.id);
    })

    test("GivenTwoUsers_WhenUnfollowUserIsCalled_ThenNoFollowBetweenThemShouldBeFoundInTheDatabase", async () => {
        const user1 = users[0];
        const user2 = users[1];

        await followService.UnfollowUser(user1.id, user2.id)
        const dbCall = await db.follow.findFirst({where: {followerId: user1.id, followedId: user2.id}})

        expect(dbCall).toBe(null);
    })
})