import CollectionTab from '@/components/CollectionTab.vue'
import DecksTab from '@/components/DecksTab.vue'
import DecksView from '@/components/DecksView.vue'
import DeckView from '@/components/DeckView.vue'
import { useTabStore } from '@/stores/tabs'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'decks' } },
    { path: '/collection', component: CollectionTab, name: 'collection' },
    {
      path: '/decks',
      component: DecksTab,
      children: [
        {
          path: '',
          name: 'decks',
          component: DecksView,
        },
        {
          path: ':id',
          name: 'deck',
          component: DeckView,
        },
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  const tabStore = useTabStore()
  const fromRoot = '/' + from.path.split('/')[1]
  if (fromRoot && from.path !== '/') {
    tabStore.updateTab(fromRoot, from.fullPath)
  }
  next()
})

export default router
