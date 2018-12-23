var userId = null,
    userToken = null,
    myGraphs = [],
    addGraphCallbacks = []

var LoginStore = {
  setUserId: (id) => userId = id,
  getUserId: () => userId,
  setUserToken: (token) => userToken = token,
  getUserToken: () => userToken,
  setGraphs: (graphs) => myGraphs = graphs,
  addGraph: (graph) => {
    myGraphs.push(graph)
    myGraphs.sort((a, b) => {
      return a.id < b.id ? -1 : 1
    })
    addGraphCallbacks.forEach(cb => cb(myGraphs))
  },
  onAddGraph: (callback) => addGraphCallbacks.push(callback),
  removeGraph: (graphId) => {
    myGraphs = myGraphs.filter(g => g.id == graphId)
  },
  getGraphs: () => myGraphs,
}

export default LoginStore