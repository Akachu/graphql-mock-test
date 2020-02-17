import "reflect-metadata";
import * as Koa from "koa";
import * as jwt from "jsonwebtoken";
import { ApolloServer, Request } from "apollo-server-koa";
import { createConnection } from "typeorm";
import { buildSchema, AuthChecker } from "type-graphql";

import * as jwtConfig from "../jwtconfig.json";
import { AuthResolver } from "./resolver/Auth";
import { UserResolver } from "./resolver/User";

function getClaims(request: any) {
  const { ctx } = request;
  const { req } = ctx;
  let result;
  let token = req.headers.authorization;
  if (!token) return null;
  try {
    result = jwt.verify(token, jwtConfig.secret);
  } catch (e) {
    console.error(e);
    return null;
  }
  return result;
}

const authChecker: AuthChecker<any> = (
  { root, args, context, info },
  roles
) => {
  return context.claims;
};

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
      resolvers: [UserResolver, AuthResolver],
      authChecker
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }

  const server = new ApolloServer({
    schema,
    context: req => ({
      ...req,
      claims: getClaims(req)
    })
  });

  const app = new Koa();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
