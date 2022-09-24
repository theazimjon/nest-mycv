import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { create } from "domain";

describe("AuthService", () => {// better organize
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create fake copy of user
    const users: User[] = [];

    fakeUsersService = {
      find: (email) =>{
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {   // if anyones ask for UsersService give them fakeUsersService
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  })

  it("can create instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("create a new user with a salted and hashed password", async () => {
    const  user = await service.signup("test@gmail.com", "test");
    expect(user.password).not.toEqual("test");
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it("throws error if user signs up with already existing email", async () => {
    await service.signup("test@gmail.com", "test");
    await expect(service.signup("test@gmail.com", "test")).rejects.toThrow(BadRequestException);
    })

  it("throws if sign in called with unregistered email", async () => {
    await expect(service.signin("test@gmail.com", "test")).rejects.toThrow(NotFoundException)
  })

  it("throws if an invalid password is provided", async () => {
    // fakeUsersService.find = () => Promise.resolve([{email: "test@gmail.com", password: "testpassword"} as User]);
    await service.signup("test@gmail.com", "incorrect");
    await expect(service.signin("test@gmail.com", "test")).rejects.toThrow(BadRequestException)
  })

  it("returns user if correct password provided", async () => {
    await service.signup("test@gmail.com", "test");

    const user = await service.signin("test@gmail.com", "test");
    expect(user).toBeDefined();

  })

})
