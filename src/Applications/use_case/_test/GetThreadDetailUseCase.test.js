// // const ExistingComment = require('../../../Domains/comments/entities/ExistingComment');
// // const CommentRepository = require('../../../Domains/comments/CommentRepository');
// // const ThreadCommentRepository = require('../../../Domains/threads_comments/ThreadCommentRepository');
// const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

// describe('GetThreadDetailUseCase', () => {
//   it('should orchestrating the get thread action correctly', async () => {
//     // Arrange
//     const credentialId = 'user-456';
//     const threadId = 'thread-123'
//     const mockNewThread = new ExistingThread({
//       id: 'thread-123',
//       title: 'sebuah thread',
//       body: 'isi body yang lengkap',
//       owner: 'user-456',
//       created_at: '2023-06-16T01:02:03.456Z',
//       updated_at: '2023-06-16T01:02:03.456Z',
//     });
//     const commentId = 'comment-123'
//     const mockNewComment = new ExistingComment({
//       id: commentId,
//       content: 'sebuah comment',
//       owner: credentialId,
//       created_at: '2023-06-16T01:02:03.456Z',
//       updated_at: '2023-06-16T01:02:03.456Z',
//       is_delete: false,
//     });
//     const threadCommentId = 'thread-comment-123';
//     const mockNewThreadComment = {
//       id: threadCommentId,
//       thread_id: mockNewThread.id,
//       comment_id: mockNewComment.id,
//     }

//     /** creating dependency of use case */
//     const mockCommentRepository = new CommentRepository();
//     const mockThreadCommentRepository = new ThreadCommentRepository();

//     /** mocking needed function */
//     mockCommentRepository.getCommentById = jest.fn()
//       .mockImplementation(() => Promise.resolve(mockNewComment));
//     mockCommentRepository.verifyCommentOwner = jest.fn()
//       .mockImplementation(() => Promise.resolve());
//     mockCommentRepository.deleteCommentById = jest.fn()
//       .mockImplementation(() => Promise.resolve());
//     mockThreadCommentRepository.deleteThreadCommentById = jest.fn()
//       .mockImplementation(() => Promise.resolve());
    
//     /** creating use case instance */
//     const deleteCommentUseCase = new DeleteCommentUseCase({
//       commentRepository: mockCommentRepository,
//       threadCommentRepository: mockThreadCommentRepository,
//     });

//     // Action
//     await deleteCommentUseCase.execute(credentialId, threadId, commentId);

//     // Assert
//     expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
//     expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, credentialId);
//     expect(mockThreadCommentRepository.deleteThreadCommentById).toBeCalledWith(threadId, commentId);
//     expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
//   });
// });
