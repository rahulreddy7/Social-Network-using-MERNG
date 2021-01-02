const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const authenticateUser = require("../../utils/auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({createdAt:-1});
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postID }) {
      try {
        const post = await Post.findById(postID);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = authenticateUser(context);
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = newPost.save();
      return post;
    },
    async deletePost(_, { postID }, context) {
      const user = authenticateUser(context);
      try {
        const post = await Post.findById(postID);
        console.log(post.username);
        console.log(user.username);
        if (user.username === post.username) {
          await post.delete();
          return "Post has been deleted successfully";
        }else{
            throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
          throw new Error(err);
      }
    },

    async likePost(_,{postID},context){
      const user=authenticateUser(context);
      const post=await Post.findById(postID);
      if(post){
        const like=post.likes.find(like=>like.username===user.username);
        // if user have already liked a post then that post is unliked.
        if(like){
          post.likes=post.likes.filter(like=>like.username!==user.username)
        }else{
          // Else user likes the post
          post.likes.push({
            username:user.username,
            createdAt:new Date().toISOString()
          })
        }
        await post.save();
        return post;
      }else throw new UserInputError('Post not found');
    }
  },
};
