import { getConnection } from "typeorm";
import { User } from "./entity/User";

export const resolvers = {
  Query: {
    getUser: async (_: any, args: any) => {
      const connection = getConnection();

      const { id } = args;
      return await connection.manager.findOne(User, {
        where: {
          id
        }
      });
    }
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      const connection = getConnection();

      const { firstName, lastName, age } = args;

      try {
        const user = connection.manager.create(User, {
          firstName,
          lastName,
          age
        });

        await connection.manager.save(user);
        return true;
      } catch (err) {
        return false;
      }
    }
  }
};
