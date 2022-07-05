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
        span: 12
      }
    },
    detail: {
      span: 12
    }
  },
  {
    field: 'code',
    label: t('group.code')
  },
  {
    field: 'stock_count',
    label: t('group.stock_count'),
    disabled: true,
    form: {
      show: true,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'create_time',
    label: t('tableDemo.displayTime'),
    form: {
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

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
}

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
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const openDetail = (row: GroupData) => {
  let url = '/group/index1123' + row.id
  let r: RouteRecordRaw = {
    path: url,
    //component: () => import('@/views/Stock/StockList.vue'),
    component: () => import('@/views/Guide/Guide.vue'),
    //redirect: '/stock/stockList',
    name: 'GuideList222' + row.id,
    meta: {
      title: url,
      icon: 'cib:telegram-plane'
    }
  }

  router.addRoute('Root', r)

  // push('/group/index1123')

  push(url)
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as GroupData
      const res = await saveGroupApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
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
