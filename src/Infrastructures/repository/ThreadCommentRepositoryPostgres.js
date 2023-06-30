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
      throw new NotFoundError('thread Comment tidak ditemukan');
    }
    return result.rows;
  }

  async verifyThreadCommentById(threadId, commentId) {
    const query = {
      text: 'SELECT * FROM threads_comments WHERE thread_id = $1 AND comment_id = $2',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread Comment tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = ThreadCommentRepositoryPostgres;
