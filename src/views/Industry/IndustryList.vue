<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
// import { SearchButton } from '@/components/SearchButton'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElLink } from 'element-plus'
import { Table } from '@/components/Table'
import { getIndustryListApi } from '@/api/industry'
import { useTable } from '@/hooks/web/useTable'
import { GroupData } from '@/api/group/types'
import { h, ref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { useRouter, RouteRecordRaw } from 'vue-router'
// import { useIcon } from '@/hooks/web/useIcon'
import { getCurrentUser } from '@/api/login'

import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

// import { usePermissionStore } from '@/store/modules/permission'

const { register, tableObject, methods } = useTable<GroupData>({
  getListApi: getIndustryListApi,
  // delListApi: delGroupListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
const appStore = useAppStoreWithOut()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)

const userId = ref('')

// const stockByIndustry = (row) =>{
//   console.log(row)
// }

const currUser = async () => {
  const res = await getCurrentUser()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  console.log('currUser==res=====', res)
  if (res) {
    userId.value = res.data.id
    userInfo.id = res.data.id
    wsCache.set(appStore.getUserInfo, userInfo)
  }
}
currUser()

const { getList, setSearchParams } = methods
// const { push } = useRouter()
// const plus = useIcon({ icon: 'ant-design:plus-outlined' })
// // const chart = useIcon({ icon: 'icon-park-outline:stock-market' })
// const table = useIcon({ icon: 'carbon:table' })
// const del = useIcon({ icon: 'ep:delete' })
// const edit = useIcon({ icon: 'bx:edit' })

// const store = usePermissionStore()
// console.log('store===', store.getRouters.length, store.getRouters)
// let router = useRouter()
getList()

const { t } = useI18n()

const writeRef = ref<ComponentRef<typeof Write>>()
// const write = unref(writeRef)

const genCode = (val: string) => {
  console.log('genCode--val===', val)
  // write?.setValues({
  //   remark: val
  // })
  //console.log('genCode--val==end ', val)
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'cate33',
    label: t('group.name'),
    search: {
      show: true
    },
    form: {
      colProps: {
        span: 24
      },
      componentProps: {
        onChange: genCode
      }
    },
    detail: {
      span: 12
    }
  },
  {
    field: 'cnt',
    label: t('group.stock_count'),
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          // click: stockByIndustry(row),
          underline: false,
          type: 'primary',
          href: '/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=0'
        },
        // ElButton,
        // {
        //   click: stockByIndustry(row),
        //   //underline: false ,
        //   plain: true,
        //   linke: true,
        //   type: 'primary' ,
        //   href: '/#/stock/StockList?del=1&from=industry'
        // },
        () => cellValue
      )
    },
    // type: 'count',
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'c30',
    label: 'TOPIX Core30',
    disabled: true,
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          underline: false,
          type: cellValue==='0'?'info':'primary',
          href: cellValue==='0'?'/#/industry/index':'/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=1'
        },
        () => cellValue
      )
    },
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'l70',
    label: 'TOPIX Large70',
    disabled: true,
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          underline: false,
          type: cellValue==='0'?'info':'primary',
          href: cellValue==='0'?'/#/industry/index':'/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=1'
        },
        () => cellValue
      )
    },
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'm400',
    label: 'TOPIX Mid400',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          underline: false,
          type: cellValue==='0'?'info':'primary',
          href: cellValue==='0'?'/#/industry/index':'/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=1'
        },
        () => cellValue
      )
    },
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 's1',
    label: 'TOPIX Small 1',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          underline: false,
          type: cellValue==='0'?'info':'primary',
          href: cellValue==='0'?'/#/industry/index':'/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=1'
        },
        () => cellValue
      )
    },
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 's2',
    label: 'TOPIX Small 2',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          underline: false,
          type: cellValue==='0'?'info':'primary',
          href: cellValue==='0'?'/#/industry/index':'/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=1'
        },
        () => cellValue
      )
    },
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'other',
    label: '-',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          underline: false,
          type: cellValue==='0'?'info':'primary',
          href: cellValue==='0'?'/#/industry/index':'/#/industry/stock?&from=industry&indId=' + row.cate33_code + '&size=1'
        },
        () => cellValue
      )
    },
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  }
  // {
  //   field: 'action',
  //   width: '260px',
  //   label: t('tableDemo.action'),
  //   form: {
  //     show: false
  //   },
  //   detail: {
  //     show: false
  //   }
  // }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')

//const delLoading = ref(false)

// const delData = async (row: GroupData | null, multiple: boolean) => {
//   tableObject.currentRow = row
//   const { delList, getSelections } = methods
//   const selections = await getSelections()
//   delLoading.value = true
//   await delList(
//     multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
//     multiple
//   ).finally(() => {
//     delLoading.value = false
//   })
// }

// getList: async () => {
//       tableObject.loading = true
//       const res = await config?.getListApi(unref(paramsObj)).finally(() => {
//         tableObject.loading = false
//       })
//       if (res) {
//         tableObject.tableList = get(res.data || {}, config?.response.list as string)
//         tableObject.total = get(res.data || {}, config?.response?.total as string) || 0
//       }
//     },

const actionType = ref('')

//const save = async () => {
// const action = async (row: GroupData, type: string) => {
// console.log('action--type===', type, row)

// dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
// actionType.value = type
// tableObject.currentRow = row
//   const res = await getStocksByCategoryId({ id: row.id })
//     .catch(() => {})
//     .finally(() => {
//       loading.value = false
//     })

//   console.log('res=====', res)
//   if (res) {
//     let stockCodes = []
//     for (let item of res.data) {
//       stockCodes.push(item.code as never)
//     }
//     tableObject.currentRow.stocks = stockCodes.join(',')
//   }
//   dialogVisible.value = true
// }

// const addAction = (type: string) => {
//   dialogTitle.value = t('exampleDemo.add')
//   actionType.value = type
//   tableObject.currentRow = null
//   dialogVisible.value = true
// }
// const openDetail = (row: GroupData) => {
//   let url = '/stock/StockList' + row.id
//   let queryParam = {
//     id: row.id,
//     userId: row.user_id,
//     // myUserId: userId.value
//     // code: row.code.replace(/ /g, '')
//   }
//   let r: RouteRecordRaw = {
//     path: url,
//     component: () => import('@/views/Stock/StockList.vue'),
//     name: 'stock_' + row.id,
//     meta: {
//       title: row.name,
//       breadcrumb: true
//     }
//   }
//   router.addRoute('Group', r)
//   push({ path: url, query: queryParam })
// }
const loading = ref(false)

// const save = async () => {
//   const write = unref(writeRef)
//   await write?.elFormRef?.validate(async (isValid) => {
//     // console.log('isValid===', isValid)
//     if (isValid) {
//       loading.value = true
//       const data = (await write?.getFormData()) as GroupData
//       // console.log('data====', data) ;return false
//       const res = await saveGroupApi(data)
//         .catch(() => {})
//         .finally(() => {
//           loading.value = false
//         })

//       console.log('res=====', res)
//       if (res) {
//         dialogVisible.value = false
//         tableObject.currentPage = 1
//         getList()
//       }
//     }
//   })
// }
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <!-- template #action="{ row }">
        <ElButton :icon="table" type="success" @click="openDetail(row)" />

        <ElButton
          :disabled="userId != row.user_id"
          type="primary"
          :icon="edit"
          @click="action(row, 'edit')"
        />

        <ElButton
          :disabled="userId != row.user_id"
          type="danger"
          :icon="del"
          @click="delData(row, false)"
        />
      </template -->
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType === 'edit'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
