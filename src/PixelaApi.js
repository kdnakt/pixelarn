import LoginStore from './store/LoginStore'

const BASE_URL = "https://pixe.la/v1/users/"

export function getGraphs(id, token) {
  return fetch(`${BASE_URL}${id}/graphs`, {
    method: 'GET',
    headers: {
      'X-USER-TOKEN': `${token}`,
    },
  }).then(res => res.json())
}

export function createGraph(graph) {
  return fetch(`${BASE_URL}${LoginStore.getUserId()}/graphs`, {
    method: 'POST',
    headers: {
      'X-USER-TOKEN': `${LoginStore.getUserToken()}`
    },
    body: JSON.stringify(graph),
  })
}

export function getGraph(id) {
  return fetch(`${BASE_URL}${LoginStore.getUserId()}/graphs/${id}`)
}

export function commitGraph(id, date, quantity) {
  const body = {
    quantity: `${quantity}`,
  }
  return fetch(`${BASE_URL}${LoginStore.getUserId()}/graphs/${id}/${date}`, {
    method: 'PUT',
    headers: {
      'X-USER-TOKEN': `${LoginStore.getUserToken()}`,
    },
    body: JSON.stringify(body),
  })
}

export function updateGraph(graph) {
  return fetch(`${BASE_URL}${LoginStore.getUserId()}/graphs/${graph.id}`, {
    method: 'PUT',
    headers: {
      'X-USER-TOKEN': `${LoginStore.getUserToken()}`,
    },
    body: JSON.stringify(graph),
  })
}

export function deleteGraph(id) {
  return fetch(`${BASE_URL}${LoginStore.getUserId()}/graphs/${id}`, {
    method: 'DELETE',
    headers: {
      'X-USER-TOKEN': `${LoginStore.getUserToken()}`,
    },
  })
}

export function createUser(user) {
  return fetch(`${BASE_URL}`, {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export function updateToken(oldToken, newToken) {
  const body = {
    newToken: newToken,
  }
  return fetch(`${BASE_URL}${LoginStore.getUserId()}/`, {
    method: 'PUT',
    headers: {
      'X-USER-TOKEN': `${oldToken}`
    },
    body: JSON.stringify(body),
  })
}