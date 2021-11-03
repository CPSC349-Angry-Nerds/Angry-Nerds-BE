const forumService = {
  getForums(db){
    return db.from('forum')
      .select('forum.id','forum.content', 'forum.title', 'users.username','forum.date_created')
      .leftJoin('users', function(){
        this.on('forum.user_id', '=', 'users.id');}).orderBy('forum.id', 'desc');
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
      .select('comment.id','comment.content','comment.forum_id','users.username', 'comment.date_created')
      .rightJoin('users', 'users.id', 'comment.user_id')
      .where('comment.forum_id',forum_id)
      .orderBy('comment.id', 'desc');
  },
  addComment(db, comment){
    return db.insert(comment)
      .into('comment');
  }
};

module.exports = forumService;