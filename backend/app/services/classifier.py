import re
from typing import Tuple

class RuleBasedClassifier:
    """基于规则的文本分类器"""

    def __init__(self):
        # 定义分类规则
        self.rules = {
            "产品反馈": [
                r"产品", r"质量", r"性能", r"体验", r"使用", r"效果", r"满意", r"不满意",
                r"好用", r"难用", r"功能", r"界面", r"设计", r"速度", r"稳定性"
            ],
            "问题投诉": [
                r"问题", r"错误", r"崩溃", r"故障", r"无法", r"失败", r"报错", r"异常",
                r"投诉", r"抱怨", r"不满", r"缺陷", r"bug", r"卡顿", r"死机"
            ],
            "功能建议": [
                r"建议", r"希望", r"增加", r"添加", r"改进", r"优化", r"完善", r"开发",
                r"新功能", r"需求", r"期望", r"提议", r"方案", r"想法"
            ]
        }

    def classify(self, text: str) -> Tuple[str, float]:
        """对文本进行分类
        
        Args:
            text: 待分类的文本
            
        Returns:
            分类结果和置信度
        """
        # 计算每个类别的匹配分数
        scores = {}
        total_matches = 0
        
        for category, patterns in self.rules.items():
            matches = 0
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    matches += 1
            scores[category] = matches
            total_matches += matches
        
        # 确定分类结果
        if total_matches > 0:
            # 找出得分最高的类别
            max_score = max(scores.values())
            best_categories = [cat for cat, score in scores.items() if score == max_score]
            
            # 如果有多个类别得分相同，返回第一个
            category = best_categories[0]
            # 计算置信度
            confidence = max_score / total_matches
        else:
            # 没有匹配到任何规则，返回其他
            category = "其他"
            confidence = 0.5
        
        return category, confidence