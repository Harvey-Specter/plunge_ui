<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, RouteRecordRaw } from 'vue-router'
// import { useCache } from '@/hooks/web/useCache'
// import { resetRouter } from '@/router'
// import { useRouter } from 'vue-router'
// import { loginOutApi } from '@/api/login'
// import { useDesign } from '@/hooks/web/useDesign'
// import { useTagsViewStore } from '@/store/modules/tagsView'
// import { useAppStoreWithOut } from '@/store/modules/app'

// const appStore = useAppStoreWithOut()

// const tagsViewStore = useTagsViewStore()

// const { getPrefixCls } = useDesign()

// const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

// const { wsCache } = useCache()

// const userInfo = wsCache.get(appStore.getUserInfo)

// const fullUserName = userInfo.email

// const userName = fullUserName.split('@')[0]

// console.log('userInfo=====', userInfo)

const { push } = useRouter()
let router = useRouter()

const openTrash = () => {
  let url = '/stock/StockList'
  let queryParam = {
    del: 1
    // code: row.code.replace(/ /g, '')
  }
  let r: RouteRecordRaw = {
    path: url,
    component: () => import('@/views/Stock/StockList.vue'),
    name: 'StockListDel',
    meta: {
      title: t('stock.trash'),
      breadcrumb: true
    }
  }
  router.addRoute('Group', r)
  push({ path: url, query: queryParam })
}

const openIndustry = () => {
  let url = '/industry/index'
  push({ path: url })
}

const openGroupList = () => {
  let url = '/group/index'
  push({ path: url })
}
</script>

<template>
  <ElButton plain type="" @click="openGroupList" size="small" link>{{
    t('stock.groupList')
  }}</ElButton>
  <!-- ElButton plain type="" @click="openIndustry" size="small" link>{{
    t('stock.setCalc')
  }}</ElButton -->
  <ElButton plain type="" @click="openIndustry" size="small" link>{{
    t('stock.industry_sector')
  }}</ElButton>
  <ElButton plain type="" @click="openTrash" size="small" link>{{ t('stock.trash') }}</ElButton>
</template>
