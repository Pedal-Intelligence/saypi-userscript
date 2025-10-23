## Pi's new chat input selector (for new chats)

Selector:
`#__next > main > div > div > div.relative.grow.overflow-x-auto.transition-all.duration-500.flex.flex-col > div.relative.flex.flex-col.overflow-hidden.sm\:overflow-x-visible.h-full.pt-8.grow > div.relative.grow.overflow-y-hidden > div > div.flex.flex-1.flex-col.items-center.justify-center > div.relative.w-full > div > input`
JS Path:
`document.querySelector("#__next > main > div > div > div.relative.grow.overflow-x-auto.transition-all.duration-500.flex.flex-col > div.relative.flex.flex-col.overflow-hidden.sm\\:overflow-x-visible.h-full.pt-8.grow > div.relative.grow.overflow-y-hidden > div > div.flex.flex-1.flex-col.items-center.justify-center > div.relative.w-full > div > input")`
XPath:
`//*[@id="__next"]/main/div/div/div[3]/div[1]/div[2]/div/div[1]/div[2]/div/input`
HTML:
```html
<input type="text" class="placeholder:text-neutral-600" placeholder="What's on your mind?" value="" style="font-family: &quot;GT Alpina INF&quot;; font-size: 1.375rem; font-style: normal; font-weight: 400; line-height: 145%; letter-spacing: -0.01375rem; color: rgb(13, 60, 38); text-align: left; background: transparent; border: none; outline: none; flex: 1 1 0%;">
```

## Pi's existing chat input selector (for threads)
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