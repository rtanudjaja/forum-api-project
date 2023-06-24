const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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
      const credentialId = 'user-456';
      const newThread = new NewThread(credentialId, {
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
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
      const credentialId = 'user-456';
      const newThread = new NewThread(credentialId, {
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
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

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById(threadId)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const credentialId = 'user-456';
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById(threadId)).resolves.not.toThrowError(NotFoundError);
    });
  });
});