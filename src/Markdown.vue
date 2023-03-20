<script setup>
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
// 引入 katex 样式文件
import "katex/dist/katex.min.css";
import hljs from "highlight.js";
import { ref, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

// 代替 vue2 中的 this.$route
const route = useRoute();

// marked 配置
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
});

// marked-katex 插件配置
marked.use(
  markedKatex({
    throwOnError: false,
  })
);

// 默认初始值
const input = ref(`
> 亚甲基蓝

以下是一段使用JavaScript语言编写的漂亮代码示例：

\`\`\`javascript
const name = "ChatGPT";
let age = 3;

function greet(name, age) \{
  console.log(\`Hello! My name is \${name} and I am \${age} years old.\`);
\}

greet(name, age);
\`\`\`

该代码段定义了一个常量 \`name\` 和一个变量 \`age\`，并定义了一个名为 \`greet\` 的函数来打印出一个招呼字符串。在打招呼函数中使用了模板字符串，并且代码专业而简洁。所有变量和函数的命名都遵循了标准的命名规则，使代码易于阅读和理解。

代码的美感不仅在于外观，更重要的是代码可读性和可维护性。这样的一个漂亮的代码示例可以带给开发者在视觉上的愉悦，但也能够通过简单清晰的代码表达意图，让其他人或自己在未来再次查看时更加容易理解。

这是一段公式测试：$y=x_1+x_2+\\dots+x_n=\\sum_{i=1}^n{x_i}$
`);

// 获取 port 和 id，用于请求 markdown 文本数据
const port = ref(route.query.port | null);
const contentId = ref(route.query.id | null);
port.value && contentId.value
  ? fetch(`http://localhost:${port.value}/content?id=${contentId.value}`)
      .then((response) => response.json())
      .then((data) => {
        input.value = data.content;
      })
      .catch((error) => console.log(error))
  : console.log("no port or id");

// 将 markdown 文本转换为 html
const output = computed(() => marked.parse(input.value));

// 监听 input 的变化，每次变化后都会触发 nextTick
watch(input, () => {
  nextTick(() => {
    console.log("rendered");
  });
});
</script>

<template>
  <div>
    <div class="output" v-html="output"></div>
  </div>
</template>

<style>
pre > code {
  font-family: "Consolas";
  padding: 0.6em 1em 0.6em 1em !important;
  border-radius: 10px;
  white-space: pre-wrap !important;
  font-size: 13px;
}

blockquote {
  border-radius: 5px;
  border-left: thick solid var(--color-border-hover);
  padding: 3px 5px 3px 5px !important;
  margin: 5px 0px 5px 0px;
  background-color: var(--color-background-mute);
}

p > code {
  font-family: "Consolas";
  border-radius: 5px;
  padding: 0px 5px 0px 5px !important;
  background-color: var(--color-background-mute);
  color: #d19a66;
}

pre:has(code) {
  padding: 5px 0px 5px 0px;
  line-height: 1.3;
}
</style>
