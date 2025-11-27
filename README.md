# Boyfriend Camera - AI Photo Assistant 📸

一款帮助你为女友拍出更好照片的 AI 相机应用！

## ✨ 功能特点

- 🤖 **AI 人物检测**: 使用 TensorFlow.js 和 COCO-SSD 模型自动检测画面中的人物
- 📐 **构图建议**: 基于九宫格构图法则，实时提供构图指导
- 🔍 **距离建议**: 智能分析拍摄距离，提示你靠近或远离
- 📱 **PWA 支持**: 可安装到手机主屏幕，像原生应用一样使用
- 🎯 **实时反馈**: 100ms 刷新率，流畅的实时指导体验

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 `http://localhost:3000` 查看应用

## 📦 部署到 Vercel

### 方法一：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 方法二：通过 GitHub

1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测 Next.js 项目并部署

## 📱 在 iOS 13 Pro 上使用

1. 部署到 Vercel 后，使用 Safari 浏览器访问你的应用 URL
2. 点击底部的"分享"按钮
3. 选择"添加到主屏幕"
4. 现在你可以像使用原生应用一样使用它了！

**注意**: 
- iOS 需要使用 Safari 浏览器才能正常访问相机
- 首次使用时需要授予相机权限
- 建议在 HTTPS 环境下使用（Vercel 自动提供）

## 🎨 使用说明

1. **授予相机权限**: 首次打开应用时，允许访问相机
2. **对准拍摄对象**: 将相机对准你的女友
3. **查看实时建议**: 
   - 绿色 "Perfect! Shoot now!" - 构图完美，可以拍照了
   - 橙色 "Move Camera Left/Right/Up/Down" - 调整相机位置
   - 蓝色 "Too far! Move closer or Zoom In" - 距离太远
   - 红色 "Too close! Move back" - 距离太近
4. **使用缩放按钮**: 如果设备支持，底部会显示缩放按钮（0.5x, 1x, 2x, 3x）

## 🛠️ 技术栈

- **框架**: Next.js 16 + React 19
- **AI 模型**: TensorFlow.js + COCO-SSD
- **样式**: Tailwind CSS
- **PWA**: next-pwa
- **相机**: react-webcam

## 📝 注意事项

- 在移动设备上运行 AI 模型会消耗较多电量
- 检测频率设置为 100ms（10 FPS），在性能和体验之间取得平衡
- 缩放功能依赖设备支持，部分设备可能不显示缩放按钮

## 💡 未来改进

- [ ] 添加拍照功能和照片保存
- [ ] 支持更多构图规则（如黄金分割）
- [ ] 添加滤镜和美颜功能
- [ ] 支持连拍模式
- [ ] 添加照片历史记录

## 📄 License

MIT

---

Made with ❤️ for taking better photos of your girlfriend!
