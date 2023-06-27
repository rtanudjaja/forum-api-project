const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.getThreadById(threadId);
    const newComment = new NewComment(userId, useCasePayload);
    const response = await this._commentRepository.addComment(newComment);
    await this._threadCommentRepository.addThreadComment(threadId, response.id);
    return response;
  }
}

module.exports = AddCommentUseCase;
