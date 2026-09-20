import { useTranslation } from 'react-i18next'
import type { Account } from '@shared/types'

interface Props {
  accounts: Account[]
  selected: string
  onChange: (accountName: string) => void
}

function AccountSwitcher({ accounts, selected, onChange }: Props): React.JSX.Element {
  const { t } = useTranslation()
  return (
    <label className="dropdown-label">
      {t('common.account')}
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
