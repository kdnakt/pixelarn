var userId = null,
    userToken = null,
    myGraphs = []

var LoginStore = {
  setUserId: (id) => userId = id,
  getUserId: () => userId,
  setUserToken: (token) => userToken = token,
  getUserToken: () => userToken,
  setGraphs: (graphs) => myGraphs = graphs,
  addGraph: (graph) => myGraphs.push(graph),
  getGraphs: () => myGraphs,
}

export default LoginStore