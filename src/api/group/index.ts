import { useAxios } from '@/hooks/web/useAxios'
import type { GroupData } from './types'

const request = useAxios()

export const getGroupListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/categories', params })
  return res && res.data
}

export const getStocksByCategoryId = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/categories/getStocksByCategoryId', params })
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

export const getAnalyzeApi = async (id: string | null |undefined): Promise<IResponse> => {
  const res = await request.get({ url: '/categories/getAnalyzeByCategoryId', params: { id } })
  return res && res.data
}

export const delGroupListApi = async (ids: string[] | number[]): Promise<IResponse> => {
  const idsStr = ids.toString()
  const res = await request.post({ url: '/categories/delCate', data: { ids: idsStr } })
  return res && res.data
}

export const cloneData = async (data: Partial<GroupData> | number): Promise<IResponse> => {
  const res = await request.post({ url: '/categories/clone', data })
  return res && res.data
}

export const getGroupAll = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/categories/getAll' })
  return res && res.data
}