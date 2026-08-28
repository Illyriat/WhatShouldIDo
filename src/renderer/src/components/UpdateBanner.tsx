import { useState } from 'react'
import type { AppUpdater } from '../hooks/useAppUpdater'

interface Props {
  updater: AppUpdater
}

/** Only ever shows once an update has finished downloading - checking/downloading are silent. */
function UpdateBanner({ updater }: Props): React.JSX.Element | null {
  const [dismissed, setDismissed] = useState(false)

  if (updater.status.state !== 'downloaded' || dismissed) return null

  return (
    <div className="update-banner">
      <span>
        Version {updater.status.version} is ready to install.
      </span>
      <div className="update-banner__actions">
        <button className="refresh-button" onClick={updater.quitAndInstallUpdate}>
          Restart &amp; Install
        </button>
        <button className="update-banner__dismiss" onClick={() => setDismissed(true)} title="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}

export default UpdateBanner
