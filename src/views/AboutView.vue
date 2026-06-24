<template>
  <div class="about-view content-container">
    <header class="about-view__header">
      <h1>关于我</h1>
      <p class="text-secondary mt-md">一名热爱技术、设计与写作的开发者</p>
    </header>

    <div class="about-view__content article-content">
      <h2>👋 你好</h2>
      <p>
        欢迎来到我的个人博客。这里记录了我对技术的思考、学习笔记以及生活中的点滴感悟。
      </p>

      <h2>💻 技术栈</h2>
      <p>主要从事前端开发，技术栈包括：</p>
      <ul>
        <li><strong>前端框架</strong>：Vue.js、React</li>
        <li><strong>语言</strong>：JavaScript、TypeScript、HTML、CSS</li>
        <li><strong>工具链</strong>：Vite、Webpack、Git</li>
        <li><strong>后端</strong>：Node.js、Express</li>
      </ul>

      <h2>📫 联系我</h2>
      <ul>
        <li>电话：18688304782</li>
        <li>邮箱：2326531305@qq.com</li>
        <li>
          GitHub：
          <a href="https://github.com/Yatsushiro-Yuzuriha" target="_blank" rel="noopener noreferrer">个人主页</a>
        </li>
      </ul>

      <h2>📝 关于本博客</h2>
      <p>
        本博客使用 Vue 3 + Vite 构建，采用极简黑白设计风格。
        希望这里的内容能给你带来一些启发和帮助。
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-view {
  padding: var(--space-3xl) 0;

  &__header {
    text-align: center;
    margin-bottom: var(--space-3xl);

    h1 {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
    }
  }
}
</style>
