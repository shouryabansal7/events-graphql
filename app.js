const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
//express-graphql is a middleware function that takes the incoming requests and funnel the through graphql query parser and automatically
//forward them to the right resolvers, it will be our duty to set the resolver schema up
const { buildSchema, graphql } = require("graphql");
//buildSchema is a function that takes a string and that string should define ur schema.
//the advantage of this approach is that we can build our schema as a string so in a convenient written form
//and the heavy lifting of converting this to js object and so on is taken care by this graphql package
const mongoose = require("mongoose");

const Event = require("./models/event");
const res = require("express/lib/response");

const app = express();

app.use(bodyParser.json());

//! means its non nullible, means we cannot have events that do not have id.
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery{
            events: [Event!]!,

        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event._doc._id.toString() };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price,
        //   //+ is used to convert argument ot float
        //   date: args.eventInput.date,
        // };
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: result.id };
            //result.id will also work and result._doc._id.toString() will also work too
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
  })
);
//events77
//2D63USUbOmKAWaR8

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@events-cluster.e3ikd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
