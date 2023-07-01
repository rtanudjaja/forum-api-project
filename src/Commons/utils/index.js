const IS_DELETE_COMMENT_MSG = '**komentar telah dihapus**'

const mapGetThreadDetail = ({
  id,
  title,
  body,
  created_at,
  username
}) => ({
  id,
  title,
  body,
  date: created_at,
  username
});


const mapGetThreadDetailComments = ({
  id,
  username,
  created_at,
  content,
  is_delete
}) => ({
  id,
  username,
  date: created_at,
  content: is_delete ? IS_DELETE_COMMENT_MSG : content
});

module.exports = { mapGetThreadDetail, mapGetThreadDetailComments };
