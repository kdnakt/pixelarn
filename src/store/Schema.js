const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    token: 'string',
  },
}

const Schema = {
  schema: [
    UserSchema,
  ],
  schemaVersion: 1,
  migration: (_old, _new) => {
    // do nothing for v1
  }
}

export {
  UserSchema,
  Schema,
}