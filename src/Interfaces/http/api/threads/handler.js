const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadsHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { id, title, owner } = await addThreadUseCase.execute({
      ...request.payload,
      owner: credentialId
    });
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
}

module.exports = AuthenticationsHandler;
