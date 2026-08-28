import type { Character, PledgeDungeon } from '@shared/types'

interface Props {
  title: string
  dungeons: PledgeDungeon[]
  characters: Character[]
}

function DungeonTable({ title, dungeons, characters }: Props): React.JSX.Element {
  return (
    <section className="dungeon-table-section">
      <h3>{title}</h3>

      {characters.length === 0 ? (
        <p className="muted">No characters to show.</p>
      ) : (
        <div className="dungeon-table-scroll">
          <table className="dungeon-table">
            <thead>
              <tr>
                <th className="dungeon-table__char-col">Character</th>
                {dungeons.map((dungeon) => (
                  <th key={dungeon.key}>
                    <span>{dungeon.dungeonName}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {characters.map((character) => (
                <tr key={character.charId}>
                  <td className="dungeon-table__char-col">{character.charName}</td>
                  {dungeons.map((dungeon) => {
                    const done = character.completedDungeonKeys.includes(dungeon.key)
                    return (
                      <td key={dungeon.key} className={done ? 'is-done' : 'is-not-done'}>
                        {done ? '✓' : '✗'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default DungeonTable
