/* =================================================================
   组件：总入口
   引入方式：
     <script src="assets/js/components.js" defer></script>
   内部按顺序加载子组件
   ================================================================= */

(function loadComponent() {
  const scripts = ['flame.js', 'toc.js'];
  scripts.forEach(s => {
    const tag = document.createElement('script');
    tag.src = `assets/js/components/${s}`;
    tag.defer = true;
    document.head.appendChild(tag);
  });
})();
