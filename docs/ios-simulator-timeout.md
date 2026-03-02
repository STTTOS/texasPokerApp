# iOS 模拟器打开超时 (code 60) 处理

报错示例：

```text
Error: xcrun simctl openurl ... exp://... exited with non-zero code: 60
Simulator device failed to open exp://...
Operation timed out
```

## 方案一：先开模拟器，再按 i（推荐先试）

1. **先单独打开模拟器**，等完全进主屏：
   ```bash
   open -a Simulator
   ```
2. 在 Xcode 菜单栏：**File → Open Simulator** 选一个设备（如 iPhone 16 Pro Max）。
3. 再在项目里启动 Expo：
   ```bash
   npm run ios:manual
   ```
4. 终端里出现 Metro 和地址后，**再按 `i`**，让 Expo 在已打开的模拟器里打开应用。

Expo 官方说明：CLI 会使用**最后打开的**那台模拟器，先开模拟器再按 i 可减少超时。

---

## 方案二：不自动打开，在模拟器里手动输入地址

1. 启动 Metro（不自动打开模拟器）：
   ```bash
   npm run ios:manual
   ```
2. 本机打开模拟器：
   ```bash
   open -a Simulator
   ```
3. 在模拟器里打开 **Expo Go**。
4. 在 Expo Go 里**手动输入地址**（终端里会打印），例如：
   - `exp://localhost:8081`
   - 或 `exp://127.0.0.1:8081`

这样完全不依赖 `xcrun simctl openurl`，避免超时。

---

## 方案三：重置模拟器 / 重装 Expo Go

若经常超时或模拟器卡顿，可做一次「恢复出厂」：

1. 在模拟器窗口获得焦点时，菜单栏选：**Device → Erase All Content and Settings...**，确认重置。
2. 或在模拟器里**长按删除 Expo Go**，然后：
   - 运行 `npm run ios:manual`
   - 在终端按 **`Shift + i`**，选择要用的模拟器，让 CLI 重新安装 Expo Go。

---

## 方案四：清理 Xcode / 系统缓存（仍不行时再用）

- **系统设置 → 通用 → 存储**，找到「开发者」→ 点 ⓘ → 如有「缓存」可删除。
- 或定期清理 Xcode 派生数据：Xcode → Settings → Locations → 点 Derived Data 路径旁的箭头，在 Finder 里删掉内容（或整个 Derived Data 文件夹）。

---

## 其他注意

- **关 VPN** 再试，避免影响 localhost/局域网。
- 确保 **Expo Go** 已通过 App Store 或 CLI 安装到当前模拟器。
- 第一次在模拟器里打开 Expo Go 时，系统可能弹「是否打开」；若没反应，在模拟器里**点一点、拖一下**再试。
