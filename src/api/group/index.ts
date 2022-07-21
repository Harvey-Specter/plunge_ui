import { useAxios } from '@/hooks/web/useAxios'
import type { GroupData } from './types'

const request = useAxios()

export const getGroupListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/categories', params })
  return res && res.data
}

export const saveGroupApi = async (data: Partial<GroupData>): Promise<IResponse> => {
  console.log('saveGroupApi===data====', data)
  const res = await request.post({ url: '/categories', data })
  return res && res.data
}

export const getGroupDetApi = async (id: string): Promise<IResponse<GroupData>> => {
  const res = await request.get({ url: '/group/detail', params: { id } })
  return res && res.data
}

export const delGroupListApi = async (ids: string[] | number[]): Promise<IResponse> => {
  const idsStr = ids.toString();
  const res = await request.post({ url: '/categories/delCate', data:{ids:idsStr} })
  return res && res.data
}
