const ExistingComment = require('../ExistingComment');

describe('ExistingComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
    };

    // Action & Assert
    expect(() => new ExistingComment(payload)).toThrowError(
      'EXISTING_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 1234,
      owner: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
    };

    // Action & Assert
    expect(() => new ExistingComment(payload)).toThrowError(
      'EXISTING_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ExistingComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-456',
      created_at: '2023-06-16T01:02:03.456Z',
      updated_at: '2023-06-16T01:02:03.456Z',
      is_delete: false,
    };

    // Action
    const existingComment = new ExistingComment(payload);

    // Assert
    expect(existingComment).toBeInstanceOf(ExistingComment);
    expect(existingComment.id).toEqual(payload.id);
    expect(existingComment.content).toEqual(payload.content);
    expect(existingComment.owner).toEqual(payload.owner);
    expect(existingComment.created_at).toEqual(payload.created_at);
    expect(existingComment.updated_at).toEqual(payload.updated_at);
    expect(existingComment.is_delete).toEqual(payload.is_delete);
  });
});
