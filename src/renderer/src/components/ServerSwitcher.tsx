import { useTranslation } from 'react-i18next'

interface Props {
  servers: string[]
  selected: string
  onChange: (server: string) => void
}

function ServerSwitcher({ servers, selected, onChange }: Props): React.JSX.Element {
  const { t } = useTranslation()
  if (servers.length <= 1) return <></>

  return (
    <label className="dropdown-label">
      {t('common.server')}
      <select className="dropdown" value={selected} onChange={(e) => onChange(e.target.value)}>
        {servers.map((server) => (
          <option key={server} value={server}>
            {server}
          </option>
        ))}
      </select>
    </label>
  )
}

export default ServerSwitcher
