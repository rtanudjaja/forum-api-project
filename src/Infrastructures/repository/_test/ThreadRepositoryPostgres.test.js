const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadsRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return new thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: 'user-456',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: 'user-456',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action
      const newlyAddedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(newlyAddedThread).toStrictEqual(new ExistingThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: 'user-456',
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
      }));
    });
  });
});