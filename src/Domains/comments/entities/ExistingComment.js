class ExistingComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
    this.created_at = payload.created_at;
    this.updated_at = payload.updated_at;
    this.is_delete = payload.is_delete
  }

  _verifyPayload(payload) {
    const { id, content, owner, created_at, updated_at, is_delete } = payload;

    if (!id || !content || !owner || !created_at || !updated_at) {
      throw new Error('EXISTING_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof created_at !== 'string' || typeof updated_at !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('EXISTING_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ExistingComment;
