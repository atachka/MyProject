exports.queryBuilder = (fields) => {
  console.log(fields);
  const keys = Object.keys(fields);
  return keys.reduce(
    (acc, fieldName) => {
      acc.$or.push({
        [fieldName]: { $regex: fields[fieldName], $options: "$i" },
      });
      return acc;
    },
    { $or: [] }
  );
};

exports.isObjectEmpty = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;
