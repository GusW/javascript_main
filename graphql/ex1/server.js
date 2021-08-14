import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const apiConfig = {
  apiPort: 5000,
  graphqlRoute: "/graphql",
};
const { apiPort, graphqlRoute } = apiConfig;

const graphqlApi = express();
const graphqlApiSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "DummyQuery",
    fields: () => ({
      message: { type: GraphQLString, resolve: () => "Hello World" },
    }),
  }),
});

graphqlApi.use(
  graphqlRoute,
  graphqlHTTP({
    schema: graphqlApiSchema,
    graphiql: true,
  })
);
graphqlApi.listen(apiPort, () => {
  console.log(`graphqlApi server up and running on ${apiPort}`);
});
