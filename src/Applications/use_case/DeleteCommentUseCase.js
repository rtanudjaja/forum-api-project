class DeleteCommentUseCase {
  constructor({ commentRepository, threadCommentRepository }) {
    this._commentRepository = commentRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._threadCommentRepository.verifyThreadCommentById(threadId, commentId);
    return await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
