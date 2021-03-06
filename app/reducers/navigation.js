/*
  Created by Uncle Charlie, 2016/11/28

  @flow
*/

export type Tab = 'All'
  | 'Debuts'
  | 'Animated'
  | 'Rebounds'

type State = {
  tab: Tab,
}

const initialState = {
  tab: 'All',
}

export default function navigation(state: State = initialState, action): State {
  if(action.type === 'SWITCH_TAB') {
    return {...state, tab: action.tab}
  }
  if(action.type === 'SWITCH_ONE') {
    return {...state, info: action.info}
  }
  if(action.type === 'LOGGED_OUT') {
    return initialState
  }
  return state
}
