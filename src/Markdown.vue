<script>
import { marked } from "marked";
import hljs from "highlight.js";

export default {
  created() {
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

    this.port = this.$route.query.port;
    this.contentId = this.$route.query.id;
    console.log(this.port, this.contentId);
    fetch(`http://localhost:${this.port}/content?id=${this.contentId}`)
      .then((response) => response.json())
      .then((data) => (this.input = data.content));
  },
  data: () => ({
    input: ` 
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
`,
  }),
  computed: {
    output() {
      return marked(this.input);
    },
  },
  watch: {
    input: function () {
      this.$nextTick(() => {
        console.log("rendered");
      });
    },
  },
};
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
}
</style>
