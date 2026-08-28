interface Props {
  servers: string[]
  selected: string
  onChange: (server: string) => void
}

function ServerSwitcher({ servers, selected, onChange }: Props): React.JSX.Element {
  if (servers.length <= 1) return <></>

  return (
    <label className="dropdown-label">
      Server
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
