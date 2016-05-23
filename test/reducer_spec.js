import {Map, fromJS} from 'immutable'
import {expect} from 'chai'
import reducer from '../src/reducer'

describe('редюсер', () => {

  it('обрабатывает SET_ENTRIES', () => {
    const initialState = Map()
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }))
  })

  it('обрабатывает NEXT', () => {
    const initialState = fromJS({
      entries: ['Trainspotting', '28 Days Later']
    })
    const action = {type: 'NEXT'}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    }))
  })

  it('обрабатывает VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    })
    const action = {type: 'VOTE', entry: 'Trainspotting'}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1}
      },
      entries: []
    }))
  })

  it('имеет изначальное состояние', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']}
    const nextState = reducer(undefined, action)

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }))
  })

  it('может применяться с reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Trainspotting'},
      {type: 'VOTE', entry: '28 Days Later'},
      {type: 'VOTE', entry: 'Trainspotting'},
      {type: 'NEXT'}
    ]
    const finalState = actions.reduce(reducer, Map())

    expect(finalState).to.equal(fromJS({
      winner: 'Trainspotting'
    }))
  })

})
