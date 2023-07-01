const ExistingComment = require('../../Domains/comments/entities/ExistingComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, datetimeGetter) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._datetimeGetter = datetimeGetter;
  }

  async addComment(newComment) {
    const { content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = this._datetimeGetter();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, FALSE) RETURNING id, content, owner, created_at, updated_at, is_delete',
      values: [id, content, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new ExistingComment({ ...result.rows[0] });
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return new ExistingComment({ ...result.rows[0] });
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 RETURNING id, is_delete',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return result.rows;
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('user bukan pemilik komentar');
    }
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
