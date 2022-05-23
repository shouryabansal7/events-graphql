const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
//express-graphql is a middleware function that takes the incoming requests and funnel the through graphql query parser and automatically
//forward them to the right resolvers, it will be our duty to set the resolver schema up
const { buildSchema } = require("graphql");
//buildSchema is a function that takes a string and that string should define ur schema.
//the advantage of this approach is that we can build our schema as a string so in a convenient written form
//and the heavy lifting of converting this to js object and so on is taken care by this graphql package
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());

//! means its non nullible, means we cannot have events that do not have id.
//password is nullible since a lot of times we will not be returning passwords.
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

        type User{
            _id: ID!
            email: String!
            password: String
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }
        type RootQuery{
            events: [Event!]!,
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
      createEvent: async (args) => {
        console.log(args);
        try {
          const event = await new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "628b906996cdae9e411e0785",
          });
          let createdEvent;
          await event.save();
          console.log(event);
          createdEvent = { ...event._doc, _id: event.id };
          let user = await User.findById("628b906996cdae9e411e0785");
          if (!user) {
            throw new Error("User not found.");
          }
          user.createdEvents.push(event);
          await user.save();

          return createdEvent;
          //event.id will also work and event._doc._id.toString() will also work too
        } catch {
          (err) => {
            console.log(err);
            throw err;
          };
        }
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price,
        //   //+ is used to convert argument ot float
        //   date: args.eventInput.date,
        // };
      },
      createUser: async (args) => {
        console.log(args);
        try {
          let user = await User.findOne({ email: args.userInput.email });

          if (user) {
            throw new Error("User exists already.");
          }

          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          user = await new User({
            email: args.userInput.email,
            password: hashedPassword,
          });
          await user.save();
          console.log(user);

          return { ...user._doc, password: null, _id: user.id };
        } catch {
          (err) => {
            throw err;
          };
        }
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
