const ExistingComment = require('../../../Domains/comments/entities/ExistingComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadCommentRepository = require('../../../Domains/threads_comments/ThreadCommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const credentialId = 'user-456';
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const threadCommentId = 'thread-comment-123';
    const mockNewComment = new ExistingComment({
      id: commentId,
      content: 'sebuah comment',
      owner: credentialId,
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: commentId, is_delete: true }));
    mockThreadCommentRepository.verifyThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: threadCommentId,
        thread_id: threadId,
        comment_id: commentId,
      }));
    
    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(credentialId, threadId, commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, credentialId);
    expect(mockThreadCommentRepository.verifyThreadCommentById).toBeCalledWith(threadId, commentId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
  });
});
