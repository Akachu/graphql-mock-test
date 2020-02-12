import { gql } from "apollo-server-koa";

export const typeDefs = gql`
  type Query {
    getUser(id: Int!): User
  }
  type Mutation {
    addUser(firstName: String!, lastName: String, age: Int!): Boolean!
  }
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    age: Int!
  }
`;
