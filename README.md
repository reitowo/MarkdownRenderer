# Markdown Renderer
 
使用serve启动本网站（没试过file://协议，或许连服务都不用起）

在C#或其他语言中使用Playwright或其他无头浏览器框架访问本软件，访问之前用框架功能设置JS变量`csharp.markdown`

监听控制台输出`rendered`，然后截图即可

```c#
public async Task<byte[]> MarkdownSnapshot(string md) {
    var id = Guid.NewGuid().ToString().ToLower().Replace("-", "");
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
        await page.EvaluateAsync("(content) => { csharp = { markdown: content } }", md);
        await page.GotoAsync($"http://localhost:11225", new PageGotoOptions() {
        Timeout = 5000
        }).ConfigureAwait(false);
        await page.WaitForConsoleMessageAsync(new PageWaitForConsoleMessageOptions() {
        Predicate = a => a.Text.Contains("rendered"),
        Timeout = 5000
        });
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
