import re
import random
from dataclasses import dataclass
from typing import List, Dict, Optional


@dataclass
class Question:
    subject: str
    content: str
    answer: Optional[str] = None
    score: int = 10


class ExamPaperGenerator:
    """
    语数英三科同量化提取，组合成 3 面试卷生成器。
    """

    def __init__(self, questions_per_subject: int = 5, score_per_question: int = 10):
        self.questions_per_subject = questions_per_subject
        self.score_per_question = score_per_question
        self.subjects = ['语文', '数学', '英语']
        self.raw_sources: Dict[str, str] = {}
        self.parsed_questions: Dict[str, List[Question]] = {s: [] for s in self.subjects}

    def load_subject(self, subject: str, content: str):
        """加载某一科的原始文本内容。"""
        self.raw_sources[subject] = content
        self.parsed_questions[subject] = self._extract_questions(subject, content)

    def _extract_questions(self, subject: str, content: str) -> List[Question]:
        """
        从文本中提取题目。
        默认按空行分段，每段视为一题。
        可在子类中重写此方法以支持更复杂的解析。
        """
        blocks = [b.strip() for b in re.split(r'\n\s*\n', content) if b.strip()]
        questions = []
        for block in blocks:
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            if not lines:
                continue
            # 跳过仅包含答案的独立块
            if lines[0].startswith('答案：'):
                continue
            q_text = lines[0]
            answer = None
            # 同一块内下一行若是答案，则提取
            if len(lines) > 1 and lines[1].startswith('答案：'):
                answer = lines[1].replace('答案：', '').strip()
            questions.append(Question(
                subject=subject,
                content=q_text,
                answer=answer,
                score=self.score_per_question
            ))
        return questions

    def generate(self, random_select: bool = True, seed: Optional[int] = None) -> Dict:
        """
        生成试卷数据。
        返回包含三页内容的字典。
        """
        if seed is not None:
            random.seed(seed)

        selected: Dict[str, List[Question]] = {}
        for subject in self.subjects:
            pool = self.parsed_questions.get(subject, [])
            n = min(self.questions_per_subject, len(pool))
            if random_select:
                selected[subject] = random.sample(pool, n)
            else:
                selected[subject] = pool[:n]

        total_score = sum(
            q.score for qs in selected.values() for q in qs
        )

        return {
            'subjects': selected,
            'questions_per_subject': self.questions_per_subject,
            'score_per_question': self.score_per_question,
            'total_score': total_score,
            'total_questions': sum(len(qs) for qs in selected.values())
        }

    def to_markdown(self, paper: Dict, title: str = '语数英综合试卷') -> str:
        """将试卷导出为 Markdown 格式。"""
        lines = [
            f'# {title}',
            '',
            f'**总分：** {paper["total_score"]} 分　　**题量：** {paper["total_questions"]} 题',
            '',
            '---',
            ''
        ]

        page = 1
        for subject in self.subjects:
            lines.append(f'## 第 {page} 面：{subject}（每题 {paper["score_per_question"]} 分）')
            lines.append('')
            for i, q in enumerate(paper['subjects'][subject], 1):
                lines.append(f'{i}. {q.content}')
                lines.append('')
            lines.append('---')
            lines.append('')
            page += 1

        lines.append('## 答题区')
        lines.append('')
        for subject in self.subjects:
            lines.append(f'### {subject}')
            for i in range(1, len(paper['subjects'][subject]) + 1):
                lines.append(f'{i}. _________________________________')
            lines.append('')

        return '\n'.join(lines)

    def to_plain(self, paper: Dict, title: str = '语数英综合试卷') -> str:
        """将试卷导出为纯文本格式。"""
        lines = [
            title,
            f'总分：{paper["total_score"]} 分　题量：{paper["total_questions"]} 题',
            ''
        ]
        page = 1
        for subject in self.subjects:
            lines.append(f'第 {page} 面：{subject}')
            lines.append('')
            for i, q in enumerate(paper['subjects'][subject], 1):
                lines.append(f'{i}. {q.content}')
            lines.append('')
            page += 1
        return '\n'.join(lines)


def demo():
    """示例：生成一份 3 面试卷。"""
    chinese = """阅读下面文言文，解释“之”的用法。

默写《静夜思》。

分析“春风又绿江南岸”中“绿”字的妙处。

答案：运用了拟人手法，写出了春天的生机。

给下列成语选择正确释义。"""

    math = """计算：3x + 5 = 14，求 x。

求函数 y = x^2 + 2x + 1 的最小值。

答案：当 x = -1 时，最小值为 0。

一个长方形长 8cm，宽 5cm，求面积。

等差数列 2, 5, 8, ... 的第 10 项是多少？"""

    english = """Translate the following sentence into Chinese: The quick brown fox jumps over the lazy dog.

Choose the correct answer: I _____ to school every day.
A. go  B. goes  C. going

答案：A

Fill in the blank: She is ______ than her sister.
A. tall  B. taller  C. tallest

Write a sentence using the word "environment"."""

    gen = ExamPaperGenerator(questions_per_subject=3, score_per_question=10)
    gen.load_subject('语文', chinese)
    gen.load_subject('数学', math)
    gen.load_subject('英语', english)

    paper = gen.generate(random_select=False)
    md = gen.to_markdown(paper)
    print(md)

    with open('/workspace/sample_exam_paper.md', 'w', encoding='utf-8') as f:
        f.write(md)
    print('\n已保存示例试卷：/workspace/sample_exam_paper.md')


if __name__ == '__main__':
    demo()
