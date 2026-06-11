import { type Chapter } from '../data/storyboardData';

interface StoryboardTableProps {
  chapter: Chapter;
}

export default function StoryboardTable({ chapter }: StoryboardTableProps) {
  return (
    <div className="storyboard">
      <table
        className="storyboard-table"
        style={{ borderColor: 'var(--color-ash)' }}
      >
        <thead>
          <tr>
            <th style={{ width: '80px' }}>镜号</th>
            <th style={{ width: '110px' }}>景别</th>
            <th style={{ width: '180px' }}>运镜</th>
            <th>画面内容</th>
            <th style={{ width: '200px' }}>特效 / 渲染</th>
            <th style={{ width: '200px' }}>音效</th>
          </tr>
        </thead>
        <tbody>
          {chapter.shots.map((shot, idx) => (
            <tr
              key={shot.id}
              className="anim-fade-in-up"
              style={{
                animationDelay: `${idx * 0.12}s`,
                color: chapter.accentColor,
              }}
            >
              <td>
                <div className="shot-number">
                  {shot.id.toString().padStart(2, '0')}
                </div>
              </td>
              <td>
                <span className="shot-scene">{shot.scene}</span>
              </td>
              <td>
                <span className="shot-camera">{shot.camera}</span>
              </td>
              <td>
                <p className="shot-content">{shot.content}</p>
              </td>
              <td>
                <span className="shot-effects">{shot.effects}</span>
              </td>
              <td>
                <span className="shot-sound">{shot.sound}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
