import type { Account } from '@shared/types'

interface Props {
  accounts: Account[]
  selected: string
  onChange: (accountName: string) => void
}

function AccountSwitcher({ accounts, selected, onChange }: Props): React.JSX.Element {
  return (
    <label className="dropdown-label">
      Account
      <select className="dropdown" value={selected} onChange={(e) => onChange(e.target.value)}>
        {accounts.map((account) => (
          <option key={account.accountName} value={account.accountName}>
            {account.accountName}
          </option>
        ))}
      </select>
    </label>
  )
}

export default AccountSwitcher
