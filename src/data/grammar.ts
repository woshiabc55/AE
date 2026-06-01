import { GrammarQuestion } from '../types';

export const mockGrammarQuestions: GrammarQuestion[] = [
  {
    id: 'g1',
    question: 'I ___ to school every day.',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 0,
    explanation: '第一人称主语I后面使用动词原形go',
    level: 'beginner',
    language: 'english',
  },
  {
    id: 'g2',
    question: 'She ___ a beautiful song.',
    options: ['sing', 'sings', 'singing', 'sang'],
    correctAnswer: 1,
    explanation: '第三人称单数主语She后面动词要加s/es',
    level: 'beginner',
    language: 'english',
  },
  {
    id: 'g3',
    question: 'They ___ already ___ their homework.',
    options: ['have/finish', 'has/finished', 'have/finished', 'had/finished'],
    correctAnswer: 2,
    explanation: 'already表示已经完成，使用现在完成时have/has + 过去分词',
    level: 'intermediate',
    language: 'english',
  },
  {
    id: 'g4',
    question: 'If I ___ rich, I would travel the world.',
    options: ['am', 'was', 'were', 'be'],
    correctAnswer: 2,
    explanation: '虚拟语气中，条件句使用were表示与现在事实相反',
    level: 'advanced',
    language: 'english',
  },
  {
    id: 'g5',
    question: '私は毎朝コーヒーを___。',
    options: ['飲む', '飲みます', '飲んで', '飲んだ'],
    correctAnswer: 1,
    explanation: '礼貌形现在时，动词ます形',
    level: 'beginner',
    language: 'japanese',
  },
  {
    id: 'g6',
    question: '昨日、友達と映画を___。',
    options: ['見る', '見ます', '見て', '見ました'],
    correctAnswer: 3,
    explanation: '昨日表示过去，使用ました形',
    level: 'beginner',
    language: 'japanese',
  },
  {
    id: 'g7',
    question: '雨が___、傘を持って行きましょう。',
    options: ['降る', '降った', '降って', '降ると'],
    correctAnswer: 3,
    explanation: 'と表示条件，"如果下雨的话"',
    level: 'intermediate',
    language: 'japanese',
  },
  {
    id: 'g8',
    question: '勉強しないと、試験に___。',
    options: ['合格する', '合格しない', '合格した', '合格できる'],
    correctAnswer: 1,
    explanation: 'ないと表示否定条件，"如果不学习的话，就不能通过考试"',
    level: 'advanced',
    language: 'japanese',
  },
  {
    id: 'g9',
    question: '저는 매일 공부___。',
    options: ['하다', '합니다', '하는', '했습니다'],
    correctAnswer: 1,
    explanation: '해요体现在时，动词+합니다',
    level: 'beginner',
    language: 'korean',
  },
  {
    id: 'g10',
    question: '어제 친구와 영화를___。',
    options: ['보다', '봅니다', '봤어요', '보고'],
    correctAnswer: 2,
    explanation: '어제表示过去，使用过去式',
    level: 'beginner',
    language: 'korean',
  },
  {
    id: 'g11',
    question: '만약 돈이 많다면, 세계를___。',
    options: ['여행하다', '여행합니다', '여행할 거예요', '여행했어요'],
    correctAnswer: 2,
    explanation: '만약表示假设，使用将来时ㄹ 거예요',
    level: 'intermediate',
    language: 'korean',
  },
  {
    id: 'g12',
    question: '공부를 안 하면 시험에___。',
    options: ['합격하다', '합격하지 않을 거예요', '합격했어요', '합격할 거예요'],
    correctAnswer: 1,
    explanation: '안 하면表示否定条件，"如果不学习的话，考试不会及格"',
    level: 'advanced',
    language: 'korean',
  },
];

export const getGrammarQuestions = (language?: string, level?: string): GrammarQuestion[] => {
  let result = mockGrammarQuestions;
  if (language) {
    result = result.filter(q => q.language === language);
  }
  if (level) {
    result = result.filter(q => q.level === level);
  }
  return result;
};
