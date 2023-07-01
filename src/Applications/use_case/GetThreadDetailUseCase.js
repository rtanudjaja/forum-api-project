const { mapGetThreadDetail, mapGetThreadDetailComments } = require('../../Commons/utils');

class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._threadCommentRepository.getThreadComments(threadId);
    return { 
      ...mapGetThreadDetail(thread),
      comments: comments.map(mapGetThreadDetailComments)
    };
  }
}

module.exports = GetThreadDetailUseCase;
