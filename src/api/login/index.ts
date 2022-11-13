import request from '@/config/axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}


export const loginApi = async (data: UserType): Promise<IResponse<UserType>> => {
  // const res = await request.post({ url: '/user/login', data })
  console.log('loginApi data==', data)
  const res = await request.post({ url: '/authorizations', data: data })
  // console.log('loginApi res==', res)
  // console.log('loginApi res.data==', res.data)
  return res && res.data
}

export const registerApi = async (data: UserType): Promise<IResponse<UserType>> => {
  console.log('registerApi data==', data)
  const res = await request.post({ url: '/users', data: data })
  return res // && res.data
}

export const loginOutApi = async (): Promise<IResponse> => {
  const res = await request.delete({ url: 'authorizations/current' })
  return res // && res.data
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    total: number
    list: UserType[]
  }>({ url: '/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/role/list', params })
}

export const getCurrentUser = async (): Promise<IResponse> => {
  const res = await request.get({ url: 'user' })
  return res // && res.data
}
