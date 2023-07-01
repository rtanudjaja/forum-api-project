const { IS_DELETE_COMMENT_MSG } = require('../../../Commons/const');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads_comments/ThreadCommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const credentialId = 'user-456';
    const threadId = 'thread-123'
    const mockNewThread = new ExistingThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi body yang lengkap',
      owner: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
    });
    const commentId = 'comment-123'
    const mockThreadComments = [{
      id: commentId,
      content: 'sebuah comment',
      owner: credentialId,
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
      username: 'dicoding'
    }];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThread));
    mockThreadCommentRepository.getThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadComments));
    
    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getThreadComments).toBeCalledWith(threadId);
  });

  describe('_mapGetThreadDetailComments function', () => {
    it('should return the thread_detail_comment with the content value as it is when is_delete is false', () => {
      // Arrange
      const credentialId = 'user-456';
      const commentId = 'comment-123';
      const mockThreadComments = [{
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
        is_delete: false,
        username: 'dicoding'
      }];
      
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockThreadCommentRepository = new ThreadCommentRepository();
      
      /** creating use case instance */
      const getThreadDetailUseCase = new GetThreadDetailUseCase({
        threadRepository: mockThreadRepository,
        threadCommentRepository: mockThreadCommentRepository,
      });
      const mapGetThreadDetailComments = getThreadDetailUseCase._mapGetThreadDetailComments
      
       // Action
      const result = mockThreadComments.map(mapGetThreadDetailComments)

      // Assert
      expect(result).toStrictEqual([{
        id: commentId,
        username: 'dicoding',
        date: '2023-06-16T01:02:03.456Z',
        content: 'sebuah comment',
      }]);
    });
  
    it('should return the thread_detail_comment with the content value **komentar telah dihapus** when is_delete is true', () => {
      // Arrange
      const credentialId = 'user-456';
      const commentId = 'comment-123';
      const mockThreadComments = [{
        id: commentId,
        content: 'sebuah comment',
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
        is_delete: true,
        username: 'dicoding'
      }];
      
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockThreadCommentRepository = new ThreadCommentRepository();
      
      /** creating use case instance */
      const getThreadDetailUseCase = new GetThreadDetailUseCase({
        threadRepository: mockThreadRepository,
        threadCommentRepository: mockThreadCommentRepository,
      });
      const mapGetThreadDetailComments = getThreadDetailUseCase._mapGetThreadDetailComments
      
       // Action
      const result = mockThreadComments.map(mapGetThreadDetailComments)

      // Assert
      expect(result).toStrictEqual([{
        id: commentId,
        username: 'dicoding',
        date: '2023-06-16T01:02:03.456Z',
        content: IS_DELETE_COMMENT_MSG,
      }]);
    });
  });
});