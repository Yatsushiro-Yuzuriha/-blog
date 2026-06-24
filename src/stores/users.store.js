// ===== Users Store (Admin) =====
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersApi } from '@/api/users.api'

export const useUsersStore = defineStore('users', () => {
  const list = ref([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchList(params = {}) {
    loading.value = true
    try {
      const res = await usersApi.getList(params)
      list.value = res.list
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  async function updateRole(userId, role) {
    await usersApi.updateRole(userId, role)
    const user = list.value.find((u) => u.id === userId)
    if (user) user.role = role
  }

  async function deleteUser(userId) {
    await usersApi.delete(userId)
    list.value = list.value.filter((u) => u.id !== userId)
    total.value--
  }

  return { list, total, loading, fetchList, updateRole, deleteUser }
})
