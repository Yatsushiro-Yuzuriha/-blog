// ===== Route Definitions =====
// All routes with lazy-loaded components and route meta

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', layout: 'default' },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: '搜索', layout: 'default' },
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import('@/views/ArticleView.vue'),
    meta: { title: '文章', layout: 'article' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于', layout: 'default' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', layout: 'auth', guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '注册', layout: 'auth', guest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '个人资料', layout: 'default', requiresAuth: true },
  },
  // ===== Admin Routes =====
  {
    path: '/admin',
    name: 'Dashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { title: '管理后台', layout: 'admin', requiresAuth: true, roles: ['admin', 'author'] },
  },
  {
    path: '/admin/articles',
    name: 'ArticleManage',
    component: () => import('@/views/admin/ArticleManageView.vue'),
    meta: { title: '文章管理', layout: 'admin', requiresAuth: true, roles: ['admin', 'author'] },
  },
  {
    path: '/admin/articles/new',
    name: 'ArticleCreate',
    component: () => import('@/views/admin/ArticleEditView.vue'),
    meta: { title: '新建文章', layout: 'admin', requiresAuth: true, roles: ['admin', 'author'] },
  },
  {
    path: '/admin/articles/:id/edit',
    name: 'ArticleEdit',
    component: () => import('@/views/admin/ArticleEditView.vue'),
    meta: { title: '编辑文章', layout: 'admin', requiresAuth: true, roles: ['admin', 'author'] },
  },
  {
    path: '/admin/users',
    name: 'UserManage',
    component: () => import('@/views/admin/UserManageView.vue'),
    meta: { title: '用户管理', layout: 'admin', requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/comments',
    name: 'CommentManage',
    component: () => import('@/views/admin/CommentManageView.vue'),
    meta: { title: '评论管理', layout: 'admin', requiresAuth: true, roles: ['admin'] },
  },
  // ===== 404 =====
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404', layout: 'default' },
  },
]
