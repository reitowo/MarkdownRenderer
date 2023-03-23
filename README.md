# Markdown Renderer

### 渲染Markdown至图片

1. 使用`serve`本地启动网站

> 或许可以直接用文件协议访问(`file://`)
> 也可以使用 `https://md.reito.fun`

2. 在C#或其他语言中使用`Playwright`或其他无头浏览器框架访问网站，用框架功能设置 JavaScript 变量`renderOptions`

```js
var renderOptions = {
    markdown: '' // Markdown 内容
} 
```

3. 支持亮色/暗色模式，创建页面时强制`ColorScheme`即可

```c#
return await chrome.NewContextAsync(new BrowserNewContextOptions() {
   ColorScheme = ColorScheme.Dark,
   DeviceScaleFactor = 2,
   ViewportSize = new ViewportSize {
      Width = 500,
      Height = 2000
   }
});
```

4. 监听控制台输出`rendered`后再等待网络活动结束（加载图片），然后截图即可

```c#
public async Task<byte[]> MarkdownSnapshot(string md) { 
   IPage page = null;
   while (page == null) {
      try {
         page = await _ctx.NewPageAsync();
      } catch (Exception ex) {
         App.Logger.LogError(ex, "NewPage");
         await ReloadContext();
         await Task.Delay(TimeSpan.FromSeconds(1));
      }
   }
   try {
      await page.SetExtraHTTPHeadersAsync(new Dictionary<string, string> {
         {
            "User-Agent",
            "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36"
         }
      });
      await page.GotoAsync($"http://localhost:11225", new PageGotoOptions() {
         Timeout = 5000
      }).ConfigureAwait(false);
      await page.EvaluateAsync("(content) => { csharp = { markdown: content } }", md);
      await page.WaitForConsoleMessageAsync(new PageWaitForConsoleMessageOptions() {
         Predicate = a => a.Text.Contains("rendered"),
         Timeout = 5000
      });
      try {
         await page.WaitForLoadStateAsync(LoadState.NetworkIdle, new PageWaitForLoadStateOptions() {
            Timeout = 5000
         });
      } catch (Exception ex) {
         App.Logger.LogWarning(ex, "Wait For Idle");
      }
      var app = await page.QuerySelectorAsync("#app").ConfigureAwait(false);
      var clip = await app!.BoundingBoxAsync().ConfigureAwait(false);
      var ret = await page.ScreenshotAsync(new PageScreenshotOptions {
         Clip = new Clip {
            Width = clip!.Width,
            Height = clip.Height,
            X = clip.X,
            Y = clip.Y
         },
         FullPage = true, Type = ScreenshotType.Jpeg
      }).ConfigureAwait(false);
      return ret;
   } catch (Exception ex) {
      App.Logger.LogError(ex, "Snapshot");
      return null;
   } finally {
      await page.CloseAsync();
   }
}
```

### 测试

```sh
npm run dev
```

### 编译

```sh
npm run build
```
