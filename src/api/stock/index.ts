import { useAxios } from '@/hooks/web/useAxios'
import type { StockData } from './types'

const request = useAxios()

export const getStockListApi = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/categories', params })
  return res && res.data
}

export const saveStockApi = async (data: Partial<StockData>): Promise<IResponse> => {
  const res = await request.post({ url: '/group/save', data })
  return res && res.data
}

export const getStockDetApi = async (id: string): Promise<IResponse<StockData>> => {
  const res = await request.get({ url: '/group/detail', params: { id } })
  return res && res.data
}

export const delStockListApi = async (ids: string[] | number[]): Promise<IResponse> => {
  const res = await request.post({ url: '/group/delete', data: { ids } })
  return res && res.data
}
