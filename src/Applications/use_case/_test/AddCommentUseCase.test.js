const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ExistingComment = require('../../../Domains/comments/entities/ExistingComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadCommentRepository = require('../../../Domains/threads_comments/ThreadCommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = { content: 'sebuah comment' };
    const credentialId = 'user-456';

    const threadId = 'thread-123'
    const mockNewThread = new ExistingThread({
      id: threadId,
      title: 'sebuah thread',
      body: 'isi body yang lengkap',
      owner: credentialId,
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
    });
    const commentId = 'comment-123'
    const mockNewComment = new ExistingComment({
      id: commentId,
      content: 'sebuah comment',
      owner: credentialId,
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
    });
    const mockNewThreadComment = {
      id: 'thread-comment-123',
      thread_id: mockNewThread.id,
      comment_id: mockNewComment.id,
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThread));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewComment));
    mockThreadCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThreadComment));
    
    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(credentialId, threadId, useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new ExistingComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
        is_delete: false,
      })
    );

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(credentialId, { content: useCasePayload.content })
    )
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(threadId, commentId);
  });
});
