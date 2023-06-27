
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadsHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postCommentsHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  // DELETE /threads/{threadId}/comments/{commentId}
  // GET /threads/{threadId}
];

module.exports = routes;
