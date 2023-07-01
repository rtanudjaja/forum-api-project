const NewComment = require('../../../Domains/comments/entities/NewComment');
const ExistingComment = require('../../../Domains/comments/entities/ExistingComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadCommentRepository = require('../../../Domains/threads_comments/ThreadCommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = { content: 'sebuah comment' };
    const credentialId = 'user-456';

    const threadId = 'thread-123'
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
      thread_id: threadId,
      comment_id: mockNewComment.id,
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
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

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(credentialId, { content: useCasePayload.content })
    )
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(threadId, commentId);
  });
});
