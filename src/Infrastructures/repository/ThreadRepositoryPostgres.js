// const InvariantError = require('../../Commons/exceptions/InvariantError');
const ExistingThread = require('../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

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

  // async getPasswordByUsername(username) {
  //   const query = {
  //     text: 'SELECT password FROM threads WHERE username = $1',
  //     values: [username],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new InvariantError('username tidak ditemukan');
  //   }

  //   return result.rows[0].password;
  // }

  // async getIdByUsername(username) {
  //   const query = {
  //     text: 'SELECT id FROM users WHERE username = $1',
  //     values: [username],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new InvariantError('user tidak ditemukan');
  //   }

  //   const { id } = result.rows[0];

  //   return id;
  // }
}

module.exports = ThreadRepositoryPostgres;
