import {UserServiceImpl} from "../../../../src/domains/user/service";
import {UserRepositoryImpl} from "../../../../src/domains/user/repository";
import {db} from "../../../../src/utils";
import {createUsersInDb} from "../../../../src/testPreparation";

describe("Test user service", () => {
    const userService = new UserServiceImpl(new UserRepositoryImpl(db))

    let users: {username: string, email: string, password: string, id: string}[] = [];

    beforeAll(async () => {
        //Delete all users
        await db.user.deleteMany({})

        //Calls preparation function
        users = await createUsersInDb(2)
    });

    test("GivenAUser_WhenCheckingRightAfterCreatingIt_ThenUserShouldBePublicInTheDB", async () => {
        const user1 = users[0]

        //Check if user created is public
        let userInDb = await db.user.findUnique({where: {id: user1.id}})
        expect(userInDb?.isPrivate).toBe(false)
    })

    test("GivenAPublicUser_WhenCallingMakeUserPrivate_ThenUserShouldBePrivateInTheDB", async () => {
        const user1 = users[0]

        //Check if user created is public
        let userInDb = await db.user.findUnique({where: {id: user1.id}})
        expect(userInDb?.isPrivate).toBe(false)

        //Make user private
        await userService.makeUserPrivate(user1.id)

        //Check if user is now private
        userInDb = await db.user.findUnique({where: {id: user1.id}})
        expect(userInDb?.isPrivate).toBe(true)
    })
})