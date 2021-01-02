const {AuthenticationError,UserInputError}=require('apollo-server')

const Post=require('../../models/Post')
const authenticateUser=require('../../utils/auth')

module.exports={
    Mutation:{
        createComment: async (_,{postID,body},context)=>{
            const user=authenticateUser(context);
            if(body.trim()===''){
                throw new UserInputError("Empty comment",{
                    errors:{
                        body:  'body cannot be empty'
                    }
                })
            }
            const post=await Post.findById(postID);
            if(post){
                post.comments.unshift({
                    body,
                    username:user.username,
                    createdAt:new Date().toISOString()
                })
                await post.save()
                return post;
            }else throw new UserInputError("Post not found");
        },

        deleteComment: async(_,{postID,commentID},context)=>{
            const user=authenticateUser(context);

            const post=await Post.findById(postID);
            if(post){
                const comment=post.comments.findIndex(comment=>comment.id===commentID);
                if(post.comments[comment].username===user.username){
                    post.comments.splice(comment,1);
                    await post.save();
                    return post;
                }else throw new AuthenticationError("Action not allowed");
            }else throw new UserInputError("Post not found");
        }
    }
}