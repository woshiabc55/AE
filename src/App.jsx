import { PlayerProvider } from './context/PlayerContext.jsx'
import ImaxStage from './components/ImaxStage.jsx'
import StoryboardPanel from './components/StoryboardPanel.jsx'
import Transport from './components/Transport.jsx'
import Timeline from './components/Timeline.jsx'

export default function App() {
  return (
    <PlayerProvider>
      <div className="app-shell">
        <ImaxStage />
        <StoryboardPanel />
        <div className="timeline-row">
          <Transport />
          <Timeline />
        </div>
      </div>
    </PlayerProvider>
  )
}
