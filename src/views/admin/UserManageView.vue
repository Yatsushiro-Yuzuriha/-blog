<template>
  <div class="user-manage">
    <h1 class="user-manage__title">用户管理</h1>

    <BaseSpinner v-if="loading" />

    <template v-else-if="list.length > 0">
      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>注册日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in list" :key="user.id">
              <td class="admin-table__user">
                <span class="user-avatar">{{ user.username?.charAt(0) }}</span>
                {{ user.username }}
              </td>
              <td>{{ user.email }}</td>
              <td>
                <select
                  class="role-select"
                  :value="user.role"
                  @change="handleRoleChange(user, $event.target.value)"
                >
                  <option value="admin">管理员</option>
                  <option value="author">作者</option>
                  <option value="reader">读者</option>
                </select>
              </td>
              <td class="text-tertiary" style="font-size: var(--font-size-sm);">{{ user.createdAt }}</td>
              <td>
                <BaseButton variant="text" size="sm" @click="handleDelete(user)">删除</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <BaseEmpty v-else message="暂无用户" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users.store'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSpinner from '@/components/common/BaseSpinner.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

const usersStore = useUsersStore()

const list = computed(() => usersStore.list)
const loading = computed(() => usersStore.loading)

async function handleRoleChange(user, newRole) {
  await usersStore.updateRole(user.id, newRole)
}

async function handleDelete(user) {
  if (!confirm(`确定删除用户「${user.username}」？`)) return
  await usersStore.deleteUser(user.id)
}

onMounted(() => {
  usersStore.fetchList()
})
</script>

<style lang="scss" scoped>
.user-manage {
  &__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-xl);
  }
}

.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);

  th {
    text-align: left;
    padding: var(--space-sm) var(--space-md);
    border-bottom: 2px solid var(--color-border);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  td {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--color-border-light);
  }

  &__user {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
}

.user-avatar {
  @include flex-center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.role-select {
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);

  &:focus { outline: none; border-color: var(--color-text); }
}
</style>
