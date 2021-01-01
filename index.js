const { ApolloServer } = require("apollo-server");

const mongoose = require("mongoose");
const { MongoDB } = require("./config");

const typeDefs=require('./graphQL/typeDefs')
const resolvers=require('./graphQL/resolvers/index')


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req})=> ({req})
});

mongoose
  .connect(MongoDB, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
    return server.listen({ port: 5000 });
  }).then((res) => {
    console.log(`server started on port ${res.url}`);
  });
