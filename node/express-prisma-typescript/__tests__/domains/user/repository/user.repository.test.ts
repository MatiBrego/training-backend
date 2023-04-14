import {UserRepositoryImpl} from "../../../../src/domains/user/repository";
import {db} from "../../../../src/utils";
import {createUsersInDb} from "../../../../src/testPreparation";

describe("User repository tests", () =>{
    const userRepo = new UserRepositoryImpl(db);

    let users: {username: string, email: string, password: string, id: string}[] = [];

    beforeAll(async () => {
        //Delete all users
        await db.user.deleteMany({})

        //Calls preparation function
        users = await createUsersInDb(2)
    });

    test("Test getById", async () => {
        const user = await userRepo.getById(users[0].id)
        expect(user?.id).toBe(users[0].id)
    })

    test("Test getByEmailOrUsername", async () =>{
        const user = await userRepo.getByEmailOrUsername(undefined, users[0].username)
        expect(user?.id).toBe(users[0].id)
    })
});