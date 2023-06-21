const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };
    const credentialId = 'user-456';

    // Action & Assert
    expect(() => new NewThread(credentialId, payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 1234,
    };
    const credentialId = 'user-456';

    // Action & Assert
    expect(() => new NewThread(credentialId, payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'isi body yang lengkap',
    };
    const credentialId = 'user-456';

    // Action
    const newThread = new NewThread(credentialId, payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(credentialId);
  });
});
