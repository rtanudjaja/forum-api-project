const NewThread = require('../../../Domains/threads/entities/NewThread');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'isi body yang lengkap',
    };
    const credentialId = 'user-456';

    const mockNewThread = new ExistingThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi body yang lengkap',
      owner: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThread));
    
    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(credentialId, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new ExistingThread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: credentialId,
        created_at: '2023-06-16T01:02:03.456Z',
        updated_at: '2023-06-16T01:02:03.456Z',
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(credentialId, {
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
