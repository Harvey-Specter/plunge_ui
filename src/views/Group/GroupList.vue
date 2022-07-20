<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton } from 'element-plus'
import { Table } from '@/components/Table'
import { getGroupListApi, saveGroupApi, delGroupListApi } from '@/api/group'
import { useTable } from '@/hooks/web/useTable'
import { GroupData } from '@/api/group/types'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter, RouteRecordRaw } from 'vue-router'
// import { usePermissionStore } from '@/store/modules/permission'

const { register, tableObject, methods } = useTable<GroupData>({
  getListApi: getGroupListApi,
  delListApi: delGroupListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods
const { push } = useRouter()

// const store = usePermissionStore()
// console.log('store===', store.getRouters.length, store.getRouters)
let router = useRouter()
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
    field: 'name',
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
  // {
  //   field: 'code',
  //   label: t('group.code')
  // },
  {
    field: 'stock_count',
    label: t('group.stock_count'),
    type: 'count',
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'created_at',
    label: t('tableDemo.displayTime'),
    form: {
      show: false,
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        disabled: true
      }
    }
  },
  {
    field: 'remark',
    label: t('group.remark'),
    form: {
      component: 'Input',
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'stocks',
    label: t('group.stocks'),
    table: {
      show: false
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 15
      },
      colProps: {
        span: 24
      }
    }
  },

  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')

const delLoading = ref(false)

const delData = async (row: GroupData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const action = (row: GroupData, type: string) => {
  // console.log('action--type===', type, row)
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  // console.log('tableObject.currentRow===', tableObject.currentRow)
  dialogVisible.value = true
}
const addAction = (type: string) => {
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = type
  // let newGroup = {
  //   id: '',
  //   name: '',
  //   code: '',
  //   remark: '',
  //   stock_count: 0,
  //   created_at: ''
  // }
  tableObject.currentRow = null
  dialogVisible.value = true
}
const openDetail = (row: GroupData) => {
  let url = '/stock/StockList' + row.id
  let queryParam = {
    id: row.id
    // code: row.code.replace(/ /g, '')
  }
  let r: RouteRecordRaw = {
    path: url,
    component: () => import('@/views/Stock/StockList.vue'),
    name: 'stock_' + row.id,
    meta: {
      title: row.name,
      breadcrumb: true
    }
  }
  router.addRoute('Group', r)
  push({ path: url, query: queryParam })
}

// const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)
const save = async () => {
  const write = unref(writeRef)
  console.log('save 2', write, '---------------')

  await write?.elFormRef?.validate(async (isValid) => {
    console.log('isValid===', isValid)
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as GroupData
      console.log('data===', data) // return false
      const res = await saveGroupApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      
      console.log('res=====',res)
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
  // setTimeout(() => {
  //   console.log(999)
  // }, 20000)
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="addAction('edit')">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>

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
      <template #action="{ row }">
        <ElButton type="success" @click="openDetail(row)">
          {{ t('stock.opengroup') }}
        </ElButton>
        <ElButton type="primary" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
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
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
