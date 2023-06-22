const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};
    const credentialId = 'user-456';

    // Action & Assert
    expect(() => new NewComment(credentialId, payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: ['sebuah comment'],
    };
    const credentialId = 'user-456';

    // Action & Assert
    expect(() => new NewComment(credentialId, payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
    };
    const credentialId = 'user-456';

    // Action
    const newComment = new NewComment(credentialId, payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(credentialId);
  });
});
