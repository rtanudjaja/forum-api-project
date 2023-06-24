const ThreadCommentRepository = require('../../Domains/threads_comments/ThreadCommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(threadId, commentId) {
    const id = `thread-comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads_comments VALUES($1, $2, $3) RETURNING id, thread_id, comment_id',
      values: [id, threadId, commentId],
    };

    const result = await this._pool.query(query);
    return { ...result.rows[0] };
  }

  async getThreadComments(threadId) {
    const query = {
      text: 'SELECT * FROM threads_comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread Comment tidak ditemukan');
    }
    return result.rows;
  }

  async deleteThreadCommentById(threadId, commentId) {
    const query = {
      text: 'DELETE FROM threads_comments WHERE thread_id = $1 AND comment_id = $2 RETURNING id',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread Comment tidak ditemukan');
    }
    return result.rows;
  }

}

module.exports = ThreadCommentRepositoryPostgres;
