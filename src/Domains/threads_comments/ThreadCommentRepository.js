class ThreadCommentRepository {
  async addThreadComment(threadId, commentId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async getThreadComments(threadId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
  async verifyThreadCommentById(threadId, commentId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadCommentRepository;
