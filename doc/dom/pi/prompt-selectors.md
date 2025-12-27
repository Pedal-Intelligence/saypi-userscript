## Pi's new chat textarea selector (for new chats)

As of Dec 2025, Pi uses a textarea (not input) for new chats, but without the `enterkeyhint` attribute.

Selector (clean):
`textarea[placeholder]:not([placeholder=''])`

HTML (observed Dec 2025):
```html
<textarea class="block w-full resize-none bg-transparent text-primary-700 outline-none placeholder:text-neutral-600 overflow-hidden" placeholder="What's on your mind?"></textarea>
```

Note: The textarea does NOT have `enterkeyhint` attribute on new chat pages, only on existing chat pages.

## Pi's existing chat textarea selector (for threads)
Selector (raw):
`#__next > main > div > div > div.relative.grow.overflow-x-auto.transition-all.duration-500.flex.flex-col > div.relative.flex.flex-col.overflow-hidden.sm\:overflow-x-visible.h-full.pt-8.grow > div.max-h-\[40\%\].px-5.sm\:px-0.z-15.w-full.mx-auto.max-w-1\.5xl.\32 xl\:max-w-\[47rem\] > div > div > div > textarea`
Selector (clean):
`textarea[enterkeyhint]`
JS Path (raw):
`document.querySelector("#__next > main > div > div > div.relative.grow.overflow-x-auto.transition-all.duration-500.flex.flex-col > div.relative.flex.flex-col.overflow-hidden.sm\\:overflow-x-visible.h-full.pt-8.grow > div.max-h-\\[40\\%\\].px-5.sm\\:px-0.z-15.w-full.mx-auto.max-w-1\\.5xl.\\32 xl\\:max-w-\\[47rem\\] > div > div > div > textarea")")`
JS Path (clean):
`document.querySelector("textarea[enterkeyhint]")`
XPath (raw):
`//*[@id="__next"]/main/div/div/div[3]/div[1]/div[4]/div/div/div/textarea`
XPath (clean):
`//textarea[@enterkeyhint]`
HTML (raw):
```html
<textarea role="textbox" class="t-body-chat block w-full resize-none overflow-y-hidden whitespace-pre-wrap bg-transparent text-primary-700 outline-none placeholder:text-neutral-600" spellcheck="false" placeholder="What's on your mind?" enterkeyhint="enter" style="height: 28px !important;"></textarea>
```