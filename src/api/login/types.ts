export type UserLoginType = {
  username: string
  password: string
}

export type UserType = {
  username: string
  email: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}

export type IdType = {
  id: string | number
}
