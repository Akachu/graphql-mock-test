import { getConnection } from "typeorm";
import {
  Mutation,
  Resolver,
  Field,
  ArgsType,
  Args,
  ObjectType
} from "type-graphql";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@ObjectType()
export class AuthData {
  @Field()
  token: string;
}

@ArgsType()
export class SignInArgs {
  @Field()
  userId: string;

  @Field()
  password: string;
}

@ArgsType()
export class SignUpArgs extends SignInArgs {
  @Field()
  passwordConfirm: string;
}

@Resolver(of => User)
export class AuthResolver {
  @Mutation(returns => AuthData)
  async signUp(@Args() args: SignUpArgs) {
    const { userId, password, passwordConfirm } = args;

    const connection = getConnection();

    const exists = await connection.manager.findOne(User, { userId });

    if (exists) throw new Error("user alerdy exists");

    if (password !== passwordConfirm) throw new Error("password not match");

    const hash = await bcrypt.hash(password, 10);

    const user = connection.manager.create(User, {
      userId,
      password: hash
    });

    await user.save();

    const result: AuthData = { token: jwt.sign({ userId }, "such a secret") };

    return result;
  }

  @Mutation(returns => AuthData)
  async signIn(@Args() args: SignInArgs) {
    const { userId, password } = args;
    const connection = getConnection();

    const user = await connection.manager.findOne(User, { userId });

    if (!user) throw new Error("user not exists");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("password do not match");

    const result: AuthData = { token: jwt.sign({ userId }, "such a secret") };

    return result;
  }
}
