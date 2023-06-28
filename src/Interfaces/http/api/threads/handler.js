const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadsHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { id, title, owner } = await addThreadUseCase.execute(credentialId, request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id,
          title,
          owner,
        }
      },
    });
    response.code(201);
    return response;
  }

  async postCommentsHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const { id, content, owner } = await addCommentUseCase.execute(credentialId, threadId, request.payload)
    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id,
          content,
          owner,
        }
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentsHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await deleteCommentUseCase.execute(credentialId, threadId, commentId)
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationsHandler;
