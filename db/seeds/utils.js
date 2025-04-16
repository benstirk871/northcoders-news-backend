const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (articlesData) => {
  if (articlesData.length === 0){
    return {}
  }
  const result = {}
  for (let i = 0; i < articlesData.length; i++){
  result[articlesData[i].title] = articlesData[i].article_id;
  }
  return result;
};


