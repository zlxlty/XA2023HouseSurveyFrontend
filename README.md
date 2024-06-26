#### 写给 XA24 HL们
去年的分院问卷是耦合在 XA 技术组去年开发的AI社交应用Mirro上的。Mirro目前已经下线，Mirro在这个repo里的大部分页面已经被我移除了，所以现在肯定运行不起来。

技术栈主要包括：
- Typescript
- 前端框架 React.js (Next.js 历史版本用了，这一版因为要能被 Capacitor 编译成移动端原生应用所以移除了)
- 状态管理库 zustand
- 数据获取库 swr
- UI框架 Tailwind.css
- 动画库 Framer Motion

和问卷相关的前端代码主要集中在 [./apps/web/src/app/xa/](./apps/web/src/app/xa/) 里，大家可以稍微看看 `page.tsx` 和 `componets/qa-pair.tsx`. 不求全弄清楚 (~~自己写的我也看不懂了~~)，主要要借助之前的代码想想如何在今年解决以下技术问题。

1. 如何适配各种奇怪的屏幕尺寸？
2. 如何加入动效使得交互更生动，并能继续保证第一点？
3. 如何储存学员信息，并能和学员`Portal`上的信息对齐？
4. 如何部署问卷确保所有学员都能稳定、高速的访问？

因为去年问卷是采用和`GPT`问答的形式进行的，所以很大一部分业务逻辑是在和用`koa.js`写的 [后端](https://github.com/zlxlty/XA2023HouseSurveyBackend) 里的 GPT Stream 服务对接。主要的内容都在 [这个文件里](https://github.com/zlxlty/XA2023HouseSurveyBackend/blob/main/src/controller/bot.ts)。

下周开会时我再和大家一起讨论一下今年究竟如何展现分院问卷。
