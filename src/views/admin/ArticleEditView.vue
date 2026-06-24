<template>
  <div class="article-edit">
    <div class="article-edit__header">
      <h1>{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
      <BaseButton variant="ghost" to="/admin/articles">← 返回</BaseButton>
    </div>

    <form class="article-edit__form" @submit.prevent="handleSave">
      <BaseInput
        v-model="form.title"
        label="标题"
        placeholder="文章标题"
        :error="errors.title"
      />

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">分类</label>
          <select v-model="form.categoryId" class="form-select">
            <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">标签</label>
          <div class="tag-select">
            <BaseTag
              v-for="tag in tagsList"
              :key="tag.id"
              :label="tag.name"
              :variant="form.tags.includes(tag.id) ? 'active' : 'ghost'"
              clickable
              size="sm"
              @click="toggleTag(tag.id)"
            />
          </div>
        </div>
      </div>

      <!-- Editor Tabs -->
      <div class="editor-tabs">
        <button type="button" class="editor-tab" :class="{ 'editor-tab--active': mode === 'edit' }" @click="mode = 'edit'">编辑</button>
        <button type="button" class="editor-tab" :class="{ 'editor-tab--active': mode === 'preview' }" @click="mode = 'preview'">预览</button>
      </div>

      <div v-show="mode === 'edit'">
        <textarea
          v-model="form.content"
          class="article-edit__editor"
          placeholder="使用 Markdown 格式书写文章..."
        ></textarea>
      </div>

      <div v-show="mode === 'preview'" class="article-edit__preview">
        <div v-if="form.content" class="article-content" v-html="previewHtml"></div>
        <BaseEmpty v-else message="输入内容后预览" icon="📝" />
      </div>

      <div class="article-edit__footer">
        <BaseButton type="button" variant="ghost" @click="saveDraft" :loading="saving">保存草稿</BaseButton>
        <BaseButton type="submit" :loading="saving">发布</BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { useTagsStore } from '@/stores/tags.store'
import MarkdownIt from 'markdown-it'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTag from '@/components/common/BaseTag.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

const isEdit = computed(() => !!route.params.id)
const mode = ref('edit')
const saving = ref(false)

const form = reactive({
  title: '',
  content: '',
  categoryId: 1,
  tags: [],
  status: 'published',
})

const errors = reactive({ title: '' })

const categoriesList = computed(() => categoriesStore.list)
const tagsList = computed(() => tagsStore.list)

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

const previewHtml = computed(() => {
  if (!form.content) return ''
  return md.render(form.content)
})

function toggleTag(tagId) {
  const idx = form.tags.indexOf(tagId)
  if (idx > -1) {
    form.tags.splice(idx, 1)
  } else {
    form.tags.push(tagId)
  }
}

async function handleSave() {
  if (!form.title.trim()) {
    errors.title = '请输入标题'
    return
  }
  saving.value = true
  try {
    if (isEdit.value) {
      await articlesStore.updateArticle(route.params.id, { ...form, status: 'published' })
    } else {
      await articlesStore.createArticle({ ...form, status: 'published' })
    }
    router.push('/admin/articles')
  } catch (e) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function saveDraft() {
  saving.value = true
  try {
    if (isEdit.value) {
      await articlesStore.updateArticle(route.params.id, { ...form, status: 'draft' })
    } else {
      await articlesStore.createArticle({ ...form, status: 'draft' })
    }
    router.push('/admin/articles')
  } catch (e) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([categoriesStore.fetchList(), tagsStore.fetchList()])

  if (isEdit.value) {
    await articlesStore.fetchDetail(route.params.id)
    if (articlesStore.current) {
      const a = articlesStore.current
      form.title = a.title
      form.content = a.content
      form.categoryId = a.categoryId
      form.tags = a.tags?.map((t) => t.id) || []
      form.status = a.status
    }
  }
})
</script>

<style lang="scss" scoped>
.article-edit {
  &__header {
    @include flex-between;
    margin-bottom: var(--space-xl);

    h1 { font-size: var(--font-size-2xl); }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  &__editor {
    width: 100%;
    min-height: 400px;
    padding: var(--space-lg);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    line-height: 1.7;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    resize: vertical;

    &:focus {
      outline: none;
      border-color: var(--color-text);
    }
  }

  &__preview {
    min-height: 400px;
    padding: var(--space-xl);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-sm);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--color-border);
  }
}

.form-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-lg);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-xs);
}

.form-select {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: var(--font-size-sm);

  &:focus { outline: none; border-color: var(--color-text); }
}

.tag-select {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.editor-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-border);
}

.editor-tab {
  @include button-reset;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all var(--transition-fast);

  &:hover { color: var(--color-text); }

  &--active {
    color: var(--color-text);
    border-bottom-color: var(--color-text);
    font-weight: var(--font-weight-semibold);
  }
}

@include mobile {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
