import request from '@/config/axios'
import type { industryData } from './types'


export const getIndustryListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/categories/industryList', params })
  return res // && res.data
}

export const getStocksByCategoryId = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/categories/getStocksByCategoryId', params })
  return res // && res.data
}

export const saveGroupApi = async (data: Partial<industryData>): Promise<IResponse> => {
  console.log('saveGroupApi===data====', data)
  const res = await request.post({ url: '/categories', data })
  return res // && res.data
}

export const getGroupDetApi = async (id: string): Promise<IResponse<industryData>> => {
  const res = await request.get({ url: '/group/detail', params: { id } })
  return res // && res.data
}

export const delGroupListApi = async (ids: string[] | number[]): Promise<IResponse> => {
  const idsStr = ids.toString()
  const res = await request.post({ url: '/categories/delCate', data: { ids: idsStr } })
  return res // && res.data
}
