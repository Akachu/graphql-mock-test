import "reflect-metadata";
import * as Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

import { AuthResolver } from "./resolver/Auth";
import { UserResolver } from "./resolver/User";

const startServer = async () => {
  let schema;

  try {
    await createConnection();
  } catch (err) {
    console.error(err);
    process.exit();
  }

  try {
    schema = await buildSchema({
      resolvers: [UserResolver, AuthResolver]
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }

  const server = new ApolloServer({ schema });

  const app = new Koa();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
