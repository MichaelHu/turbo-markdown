# turbo-markdown

## 平台支持

该工具可自动检测并适配不同平台：
- Windows
- macOS
- Unix/Linux

## 文件处理

该工具使用特定平台的脚本处理 markdown 文件：
- Windows：使用 `.bat` 文件
- macOS：使用 `-mac.sh` 文件
- Unix/Linux：使用 `-unix.sh` 文件

## 环境变量

工具在执行过程中设置以下环境变量：
- `MARKDOWN_TURBO_ROOT`：安装根目录
- `MARKDOWN_TURBO_CMD`：markdown 处理命令路径

## 系统要求

- Node.js
- 特定平台的 markdown 处理脚本（包含在安装包中）

## 许可证

MIT

## 作者

[在此添加作者信息]