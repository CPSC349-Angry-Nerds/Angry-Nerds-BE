const forumService = {
    getForums(db){
        return db.from('forum')
            .select('forum.id','forum.content','users.username')
            .rightJoin('users', 'users.id', 'forum.user_id');
    },
    createForum(db, forum){
        return db.insert(forum)
            .into('forum')
            .returning('*')
            .then(([forum]) => forum)
            .then(forum => forumService.getForumByID(db, forum.id)
            );
    },
    getForumByID(db, forum_id){
        return forumService.getForums(db)
            .where('forum.id', forum_id)
            .first();
    },
    getCommentByForumID(db, forum_id){
        return db.from('comment')
            .select('comment.id','comment.content','comment.forum_id','users.username')
            .rightJoin('users', 'users.id', 'comment.user_id')
            .where('comment.forum_id',forum_id);
    }
};

module.exports = forumService;