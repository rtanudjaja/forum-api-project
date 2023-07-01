const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('ThreadCommentsRepository postgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThreadComment function', () => {
    it('should persist new thread_comment and return new thread_comment correctly', async () => {
      // Arrange
      const credentialId = 'user-456';
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addThreadComment(threadId, commentId)

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentsById(threadId, commentId);
      expect(threadComments).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      const credentialId = 'user-456';
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newlyAddedThreadComment = await threadCommentRepositoryPostgres.addThreadComment(threadId, commentId);

      // Assert
      expect(newlyAddedThreadComment).toStrictEqual({
        id: 'thread-comment-123',
        thread_id: threadId,
        comment_id: commentId,
      });
    });
  });

  describe('getThreadComments function', () => {
    it('should throw NotFoundError when thread_comment not available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.getThreadComments(threadId)).rejects.toThrowError(NotFoundError);
    });

    it('should return the thread_comment correctly', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';
      const credentialId = 'user-456';
      const credentialUsername = 'dicoding';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: credentialId, username: credentialUsername });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const returnedThreadComments = await threadCommentRepositoryPostgres.getThreadComments(threadId);

      // Assert
      expect(returnedThreadComments).toHaveLength(1);
      expect(returnedThreadComments[0]).toStrictEqual({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
        is_delete: false,
        username: credentialUsername,
      });
    });
  });

  describe('verifyThreadCommentById function', () => {
    it('should throw NotFoundError when thread_comment not available', async () => {
      // Arrange
      const credentialId = 'user-456';
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyThreadCommentById(threadId, commentId)).rejects.toThrowError(NotFoundError);
    });

    it('should return the thread_comment when thread_comment available', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';
      const credentialId = 'user-456';
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);
      
      // Action
      const returnedThreadComment = await threadCommentRepositoryPostgres.verifyThreadCommentById(threadId, commentId);

      // Assert
      expect(returnedThreadComment).toStrictEqual({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      });
    });
  });
});