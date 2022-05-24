const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      let events = await Event.find();

      events = await events.map((event) => {
        return transformEvent(event);
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
      createdEvent = transformEvent(event);
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
};
