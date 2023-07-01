const ExistingThread = require('../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator, datetimeGetter) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._datetimeGetter = datetimeGetter;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = this._datetimeGetter();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, body, owner, created_at, updated_at',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new ExistingThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.*, users.username FROM threads
        LEFT JOIN users ON users.id = threads.owner 
        WHERE threads.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    return new ExistingThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
