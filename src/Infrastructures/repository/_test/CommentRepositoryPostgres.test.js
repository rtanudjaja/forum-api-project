const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ExistingComment = require('../../../Domains/comments/entities/ExistingComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return new comment correctly', async () => {
      // Arrange
      const credentialId = 'user-456';
      const newComment = new NewComment(credentialId, {
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      const credentialId = 'user-456';
      const newComment = new NewComment(credentialId, {
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action
      const newlyAddedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(newlyAddedComment).toStrictEqual(new ExistingComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-456',
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
        is_delete: false
      }));
    });
  });

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById(commentId)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      const commentId = 'comment-123';
      const credentialId = 'user-456';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const datetimeGetter = () => '2023-06-16T01:02:03.456Z' //stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, datetimeGetter);

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById(commentId)).resolves.not.toThrowError(NotFoundError);
    });
  });
});