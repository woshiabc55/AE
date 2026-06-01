import { ListeningItem } from '../types';

export const mockListeningItems: ListeningItem[] = [
  {
    id: 'l1',
    title: 'Daily Routine',
    audioUrl: '',
    transcript: 'My name is Sarah. I wake up at 7 o\'clock every morning. Then I have breakfast and drink a cup of coffee. After that, I go to work by bus. I work from 9 to 5. In the evening, I usually cook dinner and watch TV before going to bed.',
    questions: [
      {
        question: 'What time does Sarah wake up?',
        options: ['6 o\'clock', '7 o\'clock', '8 o\'clock', '9 o\'clock'],
        correctAnswer: 1,
      },
      {
        question: 'How does Sarah go to work?',
        options: ['By car', 'By bus', 'By train', 'By bike'],
        correctAnswer: 1,
      },
    ],
    level: 'beginner',
    language: 'english',
  },
  {
    id: 'l2',
    title: 'Weekend Plans',
    audioUrl: '',
    transcript: 'This weekend, I\'m planning to visit my grandparents in the countryside. They live on a farm with lots of animals. I haven\'t seen them for a month, so I\'m really looking forward to it. We will probably go hiking and have a picnic.',
    questions: [
      {
        question: 'Where do the grandparents live?',
        options: ['In the city', 'On a farm', 'By the sea', 'In the mountains'],
        correctAnswer: 1,
      },
      {
        question: 'How long has the speaker not seen grandparents?',
        options: ['A week', 'Two weeks', 'A month', 'Two months'],
        correctAnswer: 2,
      },
    ],
    level: 'intermediate',
    language: 'english',
  },
  {
    id: 'l3',
    title: '会社の一日',
    audioUrl: '',
    transcript: '私は毎朝8時半に会社に着きます。まず、メールを確認してから、朝のミーティングがあります。午前中は仕事をし、昼休みには同僚とランチを食べます。午後はクライアントとの打ち合わせがあることが多いです。',
    questions: [
      {
        question: '何時に会社に着きますか？',
        options: ['8時', '8時半', '9時', '9時半'],
        correctAnswer: 1,
      },
      {
        question: '昼休みに何をしますか？',
        options: ['メールを確認する', 'ミーティングをする', '同僚とランチを食べる', 'クライアントと打ち合わせする'],
        correctAnswer: 2,
      },
    ],
    level: 'beginner',
    language: 'japanese',
  },
  {
    id: 'l4',
    title: '旅行の計画',
    audioUrl: '',
    transcript: '来月、東京に旅行に行きます。新幹線で行くつもりです。東京タワーや浅草寺を見に行きたいです。友達と一緒に予約をしました。ホテルは銀座の近くにしました。',
    questions: [
      {
        question: 'どのように東京に行きますか？',
        options: ['飛行機で', '新幹線で', 'バスで', '車で'],
        correctAnswer: 1,
      },
      {
        question: 'ホテルはどこにしましたか？',
        options: ['渋谷の近く', '銀座の近く', '新宿の近く', '池袋の近く'],
        correctAnswer: 1,
      },
    ],
    level: 'intermediate',
    language: 'japanese',
  },
  {
    id: 'l5',
    title: '학교 일과',
    audioUrl: '',
    transcript: '저는 아침 7시에 학교에 갑니다. 등교 후에는 먼저 교실을 정리하고 수업을 기다립니다. 오후 4시까지 수업이 있고, 방과 후에는 동아리 활동을 합니다. 저는 음악 동아리에 들어있어서 매일 연습을 합니다.',
    questions: [
      {
        question: '언제 학교에 갑니까?',
        options: ['6시', '7시', '8시', '9시'],
        correctAnswer: 1,
      },
      {
        question: '방과 후에 무엇을 합니까?',
        options: ['수업을 듣다', '교실을 정리하다', '동아리 활동을 하다', '숙제를 하다'],
        correctAnswer: 2,
      },
    ],
    level: 'beginner',
    language: 'korean',
  },
  {
    id: 'l6',
    title: '주말 계획',
    audioUrl: '',
    transcript: '이번 주말에는 친구들과 함께 등산을 갈 거예요. 아침 일찍 집을 나와 버스로 산에 갑니다. 점심에는 산 위에서 도시락을 먹을 계획입니다. 오후에는 사진을 찍으면서 내려올 거예요.',
    questions: [
      {
        question: '무엇을 하러 갑니까?',
        options: ['등산', '수영', '쇼핑', '영화'],
        correctAnswer: 0,
      },
      {
        question: '점심에는 무엇을 먹을 계획입니까?',
        options: ['식당에서', '도시락', '편의점 음식', '안 먹음'],
        correctAnswer: 1,
      },
    ],
    level: 'intermediate',
    language: 'korean',
  },
];

export const getListeningItems = (language?: string, level?: string): ListeningItem[] => {
  let result = mockListeningItems;
  if (language) {
    result = result.filter(item => item.language === language);
  }
  if (level) {
    result = result.filter(item => item.level === level);
  }
  return result;
};
