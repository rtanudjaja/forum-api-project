class ExistingThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.userId = payload.userId;
    this.created_at = payload.created_at;
    this.updated_at = payload.updated_at;
  }

  _verifyPayload(payload) {
    const { id, title, body, userId, created_at, updated_at } = payload;

    if (!id || !title || !body || !userId) {
      throw new Error('EXISTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof userId !== 'string' || typeof created_at !== 'string' || typeof updated_at !== 'string') {
      throw new Error('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ExistingThread;
