import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar", { unique: true, length: 64 })
  userId: string;

  @Column("varchar", { length: 60 })
  password: string;
}
