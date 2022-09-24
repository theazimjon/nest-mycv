import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>) {
  }

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return await this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  async update(id: number, attsr: Partial<User>) {
    const user = await this.repo.findOne(id);
    if (!user)
      throw new NotFoundException("user not found");
    Object.assign(user, attsr);

    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne(id);
    if (!user)
      throw new NotFoundException("user not found");

    return await this.repo.remove(user);
  }
}
