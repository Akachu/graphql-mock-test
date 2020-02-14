import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar", { unique: true, length: 64 })
  userId: string;

  @Column("varchar", { length: 60 })
  password: string;
}
