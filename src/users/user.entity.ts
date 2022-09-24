import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// import { Exclude } from "class-transformer"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Exclude() //nest recommended serialize
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log("inserted User with id ", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("removed User with id ", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("removed User with id ", this.id);
  }
}
