const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadCommentRepository();

    // Action & Assert
    await expect(threadRepository.addThreadComment({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadComments({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.verifyThreadCommentById({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
