const MSG_REQUIRED = 'This item is required.'

export function validateId(id) {
  if (!id) {
    return MSG_REQUIRED
  }
  const r1 = /[a-z]/
  const r2 = /[a-z0-9-]/
  if (!r1.test(id.charAt(0))) {
    return 'This should start with a lowercase alphabet.'
  } else if (id.length < 2) {
    return '2 characters required.'
  } else {
    for (let i = 1, l = id.length; i < l; i++) {
      if (!r2.test(id.charAt(i))) {
        return 'Lowercase alphabets, numbers and "-" are allowed.'
      }
    }
    return null
  }
}

export function validateToken(token) {
  if (!token) {
    return MSG_REQUIRED
  } else if (token.length < 8) {
    return '8 characters required.'
  } else {
    return null
  }
}

export function validateTokens(token, target, targetName) {
  if (!token) {
    return MSG_REQUIRED
  } else if (token != target) {
    return `This item should match ${targetName}.`
  } else {
    return null
  }
}