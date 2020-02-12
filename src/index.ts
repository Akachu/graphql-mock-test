import "reflect-metadata";
import { createConnection } from "typeorm";
import * as casual from "casual";
import * as Koa from "koa";
import { ApolloServer } from "apollo-server-koa";

import { typeDefs } from "./typeDefs";
// import { resolvers } from "./resolvers";

const mocks = {
  User: () => ({
    id: () => casual.integer(0, 100000),
    firstName: casual.first_name,
    lastName: casual.last_name,
    age: () => casual.integer(20, 60)
  })
};

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, mocks });

  await createConnection();

  const app = new Koa();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
