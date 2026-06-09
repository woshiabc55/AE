import { useAppStore } from '../store/useAppStore';

export default function LogBox() {
  const logs = useAppStore(s => s.logs);
  return (
    <div className="logbox">
      {logs.slice(-12).map((l, i) => (
        <div key={i}>
          <span style={{ color: '#7B2EFF' }}>[{l.ts}]</span>{' '}
          <span className={l.type}>{l.msg}</span>
        </div>
      ))}
    </div>
  );
}
