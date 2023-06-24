/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'thread-comment-123', thread_id = 'thread-123', comment_id = 'comment-123'
  }) {
    const query = {
      text: 'INSERT INTO threads_comments VALUES($1, $2, $3)',
      values: [id, thread_id, comment_id],
    };

    await pool.query(query);
  },

  async findThreadCommentsById(thread_id, comment_id) {
    const query = {
      text: 'SELECT * FROM threads_comments WHERE thread_id = $1 AND comment_id = $2',
      values: [thread_id, comment_id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  // async getThreadCommentById(thread_id, comment_id) {
  //   const query = {
  //     text: 'SELECT * FROM threads_comments WHERE thread_id = $1 AND comment_id = $2',
  //     values: [thread_id, comment_id],
  //   };

  //   const result = await pool.query(query);

  //   return result.rows[0];
  // },

  async cleanTable() {
    await pool.query('DELETE FROM threads_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
