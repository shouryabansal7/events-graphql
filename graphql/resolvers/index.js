const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const events = async (eventIds) => {
  try {
    let events = await Event.find({ _id: { $in: eventIds } });
    events = await events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return events;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//manual user population method
const user = async (userId) => {
  try {
    const U = await User.findById(userId);
    return {
      ...U._doc,
      _id: U.id,
      createdEvents: events.bind(this, U.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      let events = await Event.find();

      events = await events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });

      return events;
    } catch (err) {
      console.log(err);
      throw err;
    }
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
      createdEvent = {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      };
      let u = await User.findById("628b906996cdae9e411e0785");
      if (!u) {
        throw new Error("User not found.");
      }
      u.createdEvents.push(event);
      await u.save();

      return createdEvent;
      //event.id will also work and event._doc._id.toString() will also work too
    } catch (err) {
      console.log(err);
      throw err;
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
    } catch (err) {
      throw err;
    }
  },
};
