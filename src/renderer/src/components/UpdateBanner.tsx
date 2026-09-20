import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppUpdater } from '../hooks/useAppUpdater'

interface Props {
  updater: AppUpdater
}

// Shows only once an update has finished downloading; earlier states are silent.
function UpdateBanner({ updater }: Props): React.JSX.Element | null {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  if (updater.status.state !== 'downloaded' || dismissed) return null

  return (
    <div className="update-banner">
      <span>{t('updateBanner.readyToInstall', { version: updater.status.version })}</span>
      <div className="update-banner__actions">
        <button className="refresh-button" onClick={updater.quitAndInstallUpdate}>
          {t('updateBanner.restartAndInstall')}
        </button>
        <button
          className="update-banner__dismiss"
          onClick={() => setDismissed(true)}
          title={t('updateBanner.dismiss')}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default UpdateBanner
