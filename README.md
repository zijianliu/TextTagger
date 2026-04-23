# 文本分类工具

一个基于 Next.js + FastAPI 的文本分类工具，支持单条文本分类、批量文件分类，并提供历史记录查询功能。

## 功能特性

- ✅ 单条文本分类
- ✅ 批量文件分类（支持 .txt 和 .csv 文件）
- ✅ 分类结果展示（包含类别和置信度）
- ✅ 历史记录查询和筛选
- ✅ 基于规则的分类器（可扩展为真实模型）

## 技术栈

- **前端**：Next.js 14 + TypeScript
- **后端**：FastAPI + Python
- **数据存储**：SQLite
- **分类器**：规则版分类器（可替换为真实模型）

## 目录结构

```
TextTagger/
├── backend/               # 后端代码
│   ├── app/               # 后端应用
│   │   ├── api/           # API 接口
│   │   ├── models/        # 数据模型
│   │   └── services/      # 业务逻辑
│   ├── .env               # 环境变量
│   ├── .env.example       # 环境变量示例
│   ├── main.py            # 主应用入口
│   └── requirements.txt   # 依赖包
├── src/                   # 前端代码
│   ├── components/        # 组件
│   ├── pages/             # 页面
│   ├── services/          # 服务
│   └── types/             # 类型定义
├── .gitignore             # Git 忽略文件
├── next.config.js         # Next.js 配置
├── package.json           # 前端依赖
├── README.md              # 项目说明
└── tsconfig.json          # TypeScript 配置
```

## 启动步骤

### 1. 安装依赖

#### 前端依赖

```bash
npm install
```

#### 后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 启动服务

#### 启动后端服务

```bash
cd backend
python main.py
```

后端服务将在 `http://localhost:8000` 启动。

#### 启动前端服务

```bash
npm run dev
```

前端服务将在 `http://localhost:3000` 启动。

### 3. 访问应用

打开浏览器访问 `http://localhost:3000` 即可使用文本分类工具。

## API 接口

### 单条分类

- **接口**：`POST /api/classify`
- **请求体**：
  ```json
  {
    "text": "待分类的文本"
  }
  ```
- **响应**：
  ```json
  {
    "text": "待分类的文本",
    "category": "分类结果",
    "confidence": 0.8,
    "timestamp": "2023-06-01T12:00:00"
  }
  ```

### 批量分类

- **接口**：`POST /api/batch-classify`
- **请求体**：
  ```json
  {
    "texts": ["文本1", "文本2"]
  }
  ```
- **响应**：
  ```json
  {
    "results": [
      {
        "text": "文本1",
        "category": "分类结果1",
        "confidence": 0.8,
        "timestamp": "2023-06-01T12:00:00"
      },
      {
        "text": "文本2",
        "category": "分类结果2",
        "confidence": 0.9,
        "timestamp": "2023-06-01T12:00:00"
      }
    ]
  }
  ```

### 获取历史记录

- **接口**：`GET /api/history`
- **参数**：
  - `category`（可选）：分类筛选
- **响应**：
  ```json
  [
    {
      "text": "文本",
      "category": "分类结果",
      "confidence": 0.8,
      "timestamp": "2023-06-01T12:00:00"
    }
  ]
  ```

### 文件上传

- **接口**：`POST /api/upload`
- **请求**：`multipart/form-data`，包含 `file` 字段
- **响应**：
  ```json
  {
    "results": [
      {
        "text": "文件中的文本1",
        "category": "分类结果1",
        "confidence": 0.8,
        "timestamp": "2023-06-01T12:00:00"
      }
    ]
  }
  ```

## 分类规则

当前使用基于规则的分类器，支持以下分类：

- **产品反馈**：包含产品、质量、性能、体验等关键词
- **问题投诉**：包含问题、错误、崩溃、故障等关键词
- **功能建议**：包含建议、希望、增加、改进等关键词
- **其他**：未匹配到上述规则的文本

## 扩展说明

### 替换为真实模型

1. 在 `backend/app/services/classifier.py` 中，创建一个新的分类器类，实现 `classify` 方法
2. 在 `backend/app/api/router.py` 中，将 `RuleBasedClassifier` 替换为新的分类器实例

### 数据库配置

默认使用 SQLite 数据库，可在 `.env` 文件中修改为其他数据库。

## 测试流程

1. 启动前后端服务
2. 在前端页面输入文本，点击「开始分类」
3. 查看分类结果和置信度
4. 上传 .txt 或 .csv 文件进行批量分类
5. 在历史记录中查看分类历史
6. 使用分类筛选功能查看特定分类的历史记录