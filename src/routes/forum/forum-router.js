const express = require('express');
const { middlewareAuth } = require('../../middleware/jwt-authorization');
const UserService = require('../user/user-service');
const ForumService = require('./forum-service');
const forumRouter = express.Router();
const parser = express.json();

forumRouter  
    .route('/')
    .get(middlewareAuth, parser, async (req, res, next) => {
        try {
            const db = req.app.get('db');
            const users = await UserService.getUsers(db);
            const forums = await ForumService.getForums(db);
         
            return res.send({
                data: {
                    users,
                    forums
                }
            });
        } catch (error) {
            next(error);
        }
    })
    .post(middlewareAuth, parser, async (req,res,next) => {
        try {
            const { content, title } = req.body;
            const user_id = req.user.id;
            const data = { title, content, user_id };
            const forum = await ForumService.createForum(req.app.get('db'), data);
            
            res.send({
                data: {
                    forum_id: forum.id
                }
            });
        } catch(error){
            next(error)
        }
    }
);

forumRouter
    .route('/:id/comment')
    .post(middlewareAuth, parser, async (req, res, next) => {    
        try{
            const forumID = req.params.id;
            const db = req.app.get('db');
            const user_id = req.user.id;
            const { content } = req.body;
            const data = {
                content, user_id, forum_id: forumID
            }

            const comment = await ForumService.addComment(db, data);
            
            return res.send({status: 'good'});
        } catch(error){
            next(error)
        }
    }
);

forumRouter
    .route('/:id')
    .get(middlewareAuth, async (req, res, next) => {    
        try{
            const forumID = req.params.id;
            const db = req.app.get('db');
            const forum = await ForumService.getForumByID(db, forumID);
            const comments = await ForumService.getCommentByForumID(db, forumID);
            
            res.send({
                data: {
                    forum, 
                    comments
                }
            });
        } catch(error){
            next(error)
        }
    }
);




module.exports = forumRouter;