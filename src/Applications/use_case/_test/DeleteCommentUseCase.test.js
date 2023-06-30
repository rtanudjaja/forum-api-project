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
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewComment));
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(credentialId, threadId, commentId);

    // Assert
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, credentialId);
    expect(mockThreadCommentRepository.verifyThreadCommentById).toBeCalledWith(threadId, commentId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
  });
});
