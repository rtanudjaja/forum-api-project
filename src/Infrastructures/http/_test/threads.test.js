const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'isi body yang lengkap',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'jwt',
          credentials: { id: 'user-456' }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'jwt',
          credentials: { id: 'user-456' }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: ['isi body yang lengkap'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'jwt',
          credentials: { id: 'user-456' }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual('');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
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
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'jwt',
          credentials: { id: credentialId }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 when request thread id are not valid and/or cannot be found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'jwt',
          credentials: { id: 'user-456' }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 400 when request payload not contain needed property', async () => {
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
      const requestPayload = {
        content: ['sebuah comment'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'jwt',
          credentials: { id: credentialId }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual('');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and returned status success', async () => {
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
      const threadCommentId = 'thread-comment-123';
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: 'jwt',
          credentials: { id: credentialId }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when request delete comment is not from the owner', async () => {
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
      const threadCommentId = 'thread-comment-123';
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      });
      const server = await createServer(container);
      const nonOwnerCredentialId = 'user-789';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: 'jwt',
          credentials: { id: nonOwnerCredentialId }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 404 when request comment id are not valid and/or cannot be found', async () => {
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
      const threadCommentId = 'thread-comment-123';
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      });
      const server = await createServer(container);
      const otherCommentId = 'comment-456';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${otherCommentId}`,
        auth: {
          strategy: 'jwt',
          credentials: { id: credentialId }
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual('');
    });
  });

  // describe('when GET /threads/{threadId}', () => {
    
  // });
});
