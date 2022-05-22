const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
//express-graphql is a middleware function that takes the incoming requests and funnel the through graphql query parser and automatically
//forward them to the right resolvers, it will be our duty to set the resolver schema up
const { buildSchema, graphql } = require("graphql");
//buildSchema is a function that takes a string and that string should define ur schema.
//the advantage of this approach is that we can build our schema as a string so in a convenient written form
//and the heavy lifting of converting this to js object and so on is taken care by this graphql package

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery{
            events: [String!]!,

        }
        type RootMutation {
            createEvent(name: String):String
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ["Romantic Cooking", "Sailing"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);
