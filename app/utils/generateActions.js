const generateActions = (prefix, actionName) => ({
  REQUESTED: `${prefix}/${actionName}/REQUESTED`,
  FAILED: `${prefix}/${actionName}/FAILED`,
  FULFILLED: `${prefix}/${actionName}/FULFILLED`,
  CANCELLED: `${prefix}/${actionName}/CANCELLED`,
});

export default generateActions;
