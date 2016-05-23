import {expect} from 'chai'
import {List, Map} from 'immutable'
import {setEntries, next, vote} from '../src/core'

describe('логика приложухи', () => {

  describe('seEntries()', () => {

    it('добавляет штуки в стейт', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later')
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    })

    it('конвертит в иммутабельное', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later']
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    })

  })

  describe('next()', () => {

    it('берет следующие две штуки в голосование', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      })
      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }))
    })

    it('кладет победителя текущего голосования обратно в список штук', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      })
      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }))
    })

    it('если ничья, кладет обе штуки обратно в список', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      })
      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      }))
    })

    it('выбирает победителя когда осталась только одна штука', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 3
          })
        }),
        entries: List()
      })
      const nextState = next(state)

      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }))
    })

  })

  describe('vote()', () => {

    it('делает счёт для голосуемых штук', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      })
      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        })
      }))
    })

    it('добавляет к счету для голосуемых штук', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      })
      const nextState = vote(state, 'Trainspotting')
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        })
      }))
    })

  })

})
