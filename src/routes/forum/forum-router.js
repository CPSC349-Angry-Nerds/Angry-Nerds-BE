const express = require('express');
const { middlewareAuth } = require('../../middleware/jwt-authorization');
const UserService = require('../user/user-service');
const ForumService = require('./forum-service');
const forumRouter = express.Router();
const parser = express.json();

forumRouter
    //.all(middlewareAuth)    
    .route('/')
    .get( parser, async (req, res, next) => {
        try {
            const db = req.app.get('db');
            const users = await UserService.getUsers(db);
            const forums = await ForumService.getForums(db);

            res.send({
                data: {
                    users, 
                    forums
                }
            });
        } catch(error){
            next(error)
        }
    })
    .post( async (req,res,next) => {
        try {
            const { content, title } = req.body;
            const user_id = req.user.id;
            const data = { title, content, user_id };
            const forum = await ForumService.createForum(req.app.get('db'), data);
            console.log('create forum result', forum);
            
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
    //.all(middlewareAuth)
    .route('/:id')
    .get(async (req, res, next) => {    
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