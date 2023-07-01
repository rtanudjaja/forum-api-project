const IS_DELETE_COMMENT_MSG = '**komentar telah dihapus**';

class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._threadCommentRepository.getThreadComments(threadId);
    return { 
      ...this._mapGetThreadDetail(thread),
      comments: comments.map(this._mapGetThreadDetailComments)
    };
  }

  _mapGetThreadDetail = ({
    id,
    title,
    body,
    created_at,
    username
  }) => ({
    id,
    title,
    body,
    date: created_at,
    username
  });

  _mapGetThreadDetailComments = ({
    id,
    username,
    created_at,
    content,
    is_delete
  }) => ({
    id,
    username,
    date: created_at,
    content: is_delete ? IS_DELETE_COMMENT_MSG : content
  });
}

module.exports = GetThreadDetailUseCase;
