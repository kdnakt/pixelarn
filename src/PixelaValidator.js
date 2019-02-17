export function validateId(id) {
  if (!id) {
    return 'This item is required.'
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
