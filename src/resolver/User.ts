import { Resolver, Query, Args, ArgsType, Field } from "type-graphql";
import { User } from "../entity/User";

@ArgsType()
export class IdArgs {
  @Field()
  id: string;
}

@ArgsType()
export class UserIdArgs {
  @Field()
  userId: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUserById(@Args() args: IdArgs) {
    const { id } = args;
    return await User.findOne(User, {
      where: {
        id
      }
    });
  }

  @Query(() => [User])
  async getUserByUserId(@Args() args: UserIdArgs) {
    const { userId } = args;
    return await User.findOne(User, {
      where: {
        userId
      }
    });
  }
}
