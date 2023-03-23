<script setup>
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
// 引入 katex 样式文件
import "katex/dist/katex.min.css";
import hljs from "highlight.js";
import { ref, computed, watch, nextTick } from "vue";

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

// 替换纯代码段无样式
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

  if (matchIndentToCode === null) {
    return text;
  }

  const indentToCode = matchIndentToCode[1];

  return text
    .split("\n")
    .map((node) => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }

      const [indentInNode] = matchIndentInNode;

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    })
    .join("\n");
}

const tokenizer = {
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      var lang = cap[2]
        ? cap[2].trim().replace(this.rules.inline._escapes, "$1")
        : cap[2];
      if (lang.length == 0) {
        lang = "plaintext";
      }

      return {
        type: "code",
        raw,
        lang,
        text,
      };
    }
  },
};

marked.use({ tokenizer });

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

[链接](https://reito.fun)
https://reito.fun

\`\`\` 
greet(name, age);
greet(name, age);
greet(name, age);
\`\`\`

| 表格 | 测试 | aaaaaaaaaaaaa |
| --- | --- | --- |
| 啊啊啊 | 啊啊啊 | aaa |
| 111 | 123123 | aaa |
| 111 | 123123 | aaa |
| 111 | 123123 | aaa |

--------

任务列表:

- [ ] 未完成任务
- [x] 已完成任务
  - [ ] Test

换行:
这是一行文本
这是另一行文本 

---------------


![image](https://guild-1304010062.cos.ap-nanjing.myqcloud.com/reito/thank_foot.png)

- 111
- 222
- 333
  - 11
  - 22
    - 111
    - 111
      - 111
      - 111

1. 有序列表项 1
2. 有序列表项 2
   1. 子项 2.1
   2. 子项 2.2
      1. 子项 2.1
      2. 子项 2.2

该代码段定义了一个常量 \`name\` 和一个变量 \`age\`，并定义了一个名为 \`greet\` \`print("大家好！")\` 的函数来打印出一个招呼字符串。在打招呼函数中使用了模板字符串，并且代码专业而简洁。所有变量和函数的命名都遵循了标准的命名规则，使代码易于阅读和理解。

代码的美感不仅在于外观，更重要的是代码可读性和可维护性。这样的一个漂亮的代码示例可以带给开发者在视觉上的愉悦，但也能够通过简单清晰的代码表达意图，让其他人或自己在未来再次查看时更加容易理解。

这是一段公式测试：$y=x_1+x_2+\\dots+x_n=\\sum_{i=1}^n{x_i}$

`);

// 测试用
// setTimeout(() => {
//   input.value = csharp.markdown;
// }, 3000)

const interval = setInterval(() => {
  if (typeof csharp !== "undefined") {
    input.value = csharp.markdown;
    clearInterval(interval);
  }
}, 100);

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
  font-family: "Consolas", "思源黑体";
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
  font-family: "Consolas", "思源黑体", "Source Hans Sans";
  padding: 2px 4px;
  border-radius: 3px;
  background-color: var(--color-background-mute);
  color: #d19a66;
}

pre:has(code:is(.hljs)) {
  padding: 5px 0px 5px 0px;
  line-height: 1.3;
  margin: 3px 0;
} 

/* 定义项目符号和间隙距离变量 */
:root {
  --primary-level: "•";
  --secondary-level: "◦";
  --tertiary-level: "▪";
  --list-item-spacing: 0.5em;  
  --base-padding: 0.5em;
  --nested-padding: 1.2em;
}

ul ul, ol ul,
ul ol, ol ol {
  padding-left: var(--nested-padding); /* 嵌套列表左边距 */
}

/* 无序列表容器样式 */
ul {
  list-style-type: none; /* 移除默认列表样式 */
  padding-left: var(--base-padding);
} 

/* 一级列表项伪元素样式 */
ul li::before {
  content: var(--primary-level);
  padding-right: var(--list-item-spacing); /* 使用间隙距离变量 */
}

/* 二级列表项伪元素样式 */
ul ul li::before {
  content: var(--secondary-level);
  padding-right: var(--list-item-spacing); /* 使用间隙距离变量 */
}

/* 三级列表项伪元素样式 */
ul ul ul li::before {
  content: var(--tertiary-level);
  padding-right: var(--list-item-spacing); /* 使用间隙距离变量 */
} 

/* 有序列表（ol）容器样式 */
ol {
  list-style-type: none; /* 移除默认列表样式 */
  padding-left: var(--base-padding);
  counter-reset: ordered-list; /* 设置计数器 */ 
}

/* 有序列表（ol）列表项伪元素样式 */
ol li {
  counter-increment: ordered-list; /* 递增计数器 */
}

/* 一级列表项伪元素样式 */
ol li::before {
  content: counter(ordered-list) ". "; /* 使用计数器并添加点号 */
  padding-right: var(--list-item-spacing); /* 使用间隙距离变量 */
}

/* 二级列表项伪元素样式 */
ol ol li::before {
  content: counter(ordered-list, lower-alpha) ". "; /* 使用小写字母并添加。“作为计数器 */
  padding-right: var(--list-item-spacing); /* 使用间隙距离变量 */
}

/* 三级列表项伪元素样式 */
ol ol ol li::before {
  content: counter(ordered-list, lower-roman) ". "; /* 使用小写罗马数字并添加点号作为 */
  padding-right: var(--list-item-spacing); /* 使用间隙距离变量 */
} 

/* ul:has(input) {
  list-style-type: none; 
  padding-inline-start: 5px;
}

ul:has(input) > li > input {
  margin-right: 5px;
} 

ol:has(input) {
  list-style-type: none; 
  padding-inline-start: 5px;
}

ol:has(input) > li > input {
  margin-right: 5px;
}  */
 
hr {
  border: 1px solid var(--border-color); 
  margin: 5px 0;
}

/* 基本表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: auto;
  margin: 10px 0;
}

th, td {
  text-align: left;
  padding: 5px;
}

/* 配置浅色模式 */
:root {
  --border-color: #e2e2e2;
  --header-bg-color: #f5f5f5;
  --odd-row-bg-color: #f0f0f0;
  --border-radius: 8px;
}

/* 配置深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --border-color: #696969;
    --header-bg-color: #242424;
    --odd-row-bg-color: #494949;
  }
}

th, td {
  border-right: 1px solid var(--border-color); 
  border-bottom: none;
  border-top: none;
}

th:last-child, td:last-child {
  border-right: none;
}

/* 每行之间的横线 */
table tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--border-color);
}

/* 圆角矩形边框 */
table {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

/* 表头样式 */
table thead th {
  background-color: var(--header-bg-color);
  border-bottom: 2px solid var(--border-color);
}

/* 背景颜色交错 */
table tbody tr:nth-child(odd) {
  background-color: var(--odd-row-bg-color);
}

/* 表格圆角处理 */
table tr:first-child th:first-child {
  border-top-left-radius: var(--border-radius);
}

table tr:first-child th:last-child {
  border-top-right-radius: var(--border-radius);
}

table tr:last-child td:first-child {
  border-bottom-left-radius: var(--border-radius);
}

table tr:last-child td:last-child {
  border-bottom-right-radius: var(--border-radius);
}

a {
  color: #45a9f9;
  text-decoration: none;
} 
</style>
