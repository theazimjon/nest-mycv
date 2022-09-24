import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { Session } from "@nestjs/common";

describe("UsersController", () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: "test@example", password: "test"} as User);
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: "test"} as User]);
      },
      // remove: () => {},
      // update: () => {}
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as  User);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers returns a list of users with given email", async () => {
    const users = await controller.findAllUsers("test@gmail.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("test@gmail.com")
  });

  it("findUser returns a single user with given id", async () => {
    const user = await controller.findUser("1");
    expect(user).toBeDefined();
  })

  it("findUser returns an error if user not found with given id", async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser("1")).rejects.toThrow()
  });

  it("signin updates session objects and returns user", async () => {
    const session = {UserId: -10};
    const user = await controller.signin({email: "user@example.com", password: "test"}, session);

    expect(user.id).toEqual(1);
    expect(session.UserId).toEqual(1)
  })
});
