
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
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.deleteCommentsHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  // {
  //   method: 'GET',
  //   path: '/threads/{threadId}',
  //   handler: (request, h) => handler.getThreadsHandler(request, h),
  // },
];

module.exports = routes;
