const ExistingThread = require('../ExistingThread');

describe('ExistingThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      //missing body
      userId: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
    };

    // Action & Assert
    expect(() => new ExistingThread(payload)).toThrowError(
      'EXISTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 1234,
      userId: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
    };

    // Action & Assert
    expect(() => new ExistingThread(payload)).toThrowError(
      'EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ExistingThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi body yang lengkap',
      userId: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
    };

    // Action
    const existingThread = new ExistingThread(payload);

    // Assert
    expect(existingThread).toBeInstanceOf(ExistingThread);
    expect(existingThread.id).toEqual(payload.id);
    expect(existingThread.title).toEqual(payload.title);
    expect(existingThread.body).toEqual(payload.body);
    expect(existingThread.userId).toEqual(payload.userId);
    expect(existingThread.created_at).toEqual(payload.created_at);
    expect(existingThread.updated_at).toEqual(payload.updated_at);
  });
});
