/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('threads_comments', 'unique_thread_id_and_comment_id', 'UNIQUE(thread_id, comment_id)');

  pgm.addConstraint('threads_comments', 'fk_threads_comments.thread_id_users.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('threads_comments', 'fk_threads_comments.comment_id_albums.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('threads_comments');
};