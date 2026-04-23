from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import io
from app.services.classifier import RuleBasedClassifier
from app.models import SessionLocal, Classification, engine, Base
from datetime import datetime

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建路由器
router = APIRouter()

# 创建分类器实例
classifier = RuleBasedClassifier()

# 定义请求和响应模型
class ClassifyRequest(BaseModel):
    text: str

class ClassificationResponse(BaseModel):
    text: str
    category: str
    confidence: float
    timestamp: str

class BatchClassifyRequest(BaseModel):
    texts: List[str]

class BatchClassifyResponse(BaseModel):
    results: List[ClassificationResponse]

# 单条分类接口
@router.post("/classify", response_model=ClassificationResponse)
def classify(request: ClassifyRequest):
    try:
        # 分类文本
        category, confidence = classifier.classify(request.text)
        
        # 保存到数据库
        db = SessionLocal()
        db_classification = Classification(
            text=request.text,
            category=category,
            confidence=confidence
        )
        db.add(db_classification)
        db.commit()
        db.refresh(db_classification)
        db.close()
        
        # 返回响应
        return ClassificationResponse(
            text=request.text,
            category=category,
            confidence=confidence,
            timestamp=db_classification.timestamp.isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 批量分类接口
@router.post("/batch-classify", response_model=BatchClassifyResponse)
def batch_classify(request: BatchClassifyRequest):
    try:
        results = []
        db = SessionLocal()
        
        for text in request.texts:
            # 分类文本
            category, confidence = classifier.classify(text)
            
            # 保存到数据库
            db_classification = Classification(
                text=text,
                category=category,
                confidence=confidence
            )
            db.add(db_classification)
            
            # 添加到结果列表
            results.append(ClassificationResponse(
                text=text,
                category=category,
                confidence=confidence,
                timestamp=db_classification.timestamp.isoformat()
            ))
        
        db.commit()
        db.close()
        
        return BatchClassifyResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 获取历史记录接口
@router.get("/history", response_model=List[ClassificationResponse])
def get_history(category: Optional[str] = None):
    try:
        db = SessionLocal()
        
        # 根据分类筛选
        query = db.query(Classification)
        if category:
            query = query.filter(Classification.category == category)
        
        # 按时间倒序排列
        classifications = query.order_by(Classification.timestamp.desc()).all()
        db.close()
        
        # 转换为响应模型
        results = []
        for classification in classifications:
            results.append(ClassificationResponse(
                text=classification.text,
                category=classification.category,
                confidence=classification.confidence,
                timestamp=classification.timestamp.isoformat()
            ))
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 文件上传接口
@router.post("/upload", response_model=BatchClassifyResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        # 读取文件内容
        contents = await file.read()
        
        # 根据文件类型解析
        if file.filename.endswith(".txt"):
            # 解析文本文件
            texts = contents.decode("utf-8").splitlines()
            # 过滤空行
            texts = [text.strip() for text in texts if text.strip()]
        elif file.filename.endswith(".csv"):
            # 解析 CSV 文件
            df = pd.read_csv(io.BytesIO(contents))
            # 假设第一列是文本
            texts = df.iloc[:, 0].astype(str).tolist()
            # 过滤空值
            texts = [text.strip() for text in texts if text and text.strip()]
        else:
            raise HTTPException(status_code=400, detail="不支持的文件类型，仅支持 .txt 和 .csv 文件")
        
        # 批量分类
        results = []
        db = SessionLocal()
        
        for text in texts:
            # 分类文本
            category, confidence = classifier.classify(text)
            
            # 保存到数据库
            db_classification = Classification(
                text=text,
                category=category,
                confidence=confidence
            )
            db.add(db_classification)
            
            # 添加到结果列表
            results.append(ClassificationResponse(
                text=text,
                category=category,
                confidence=confidence,
                timestamp=db_classification.timestamp.isoformat()
            ))
        
        db.commit()
        db.close()
        
        return BatchClassifyResponse(results=results)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))