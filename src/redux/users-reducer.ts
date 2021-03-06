import { APIResponseType } from './../api/api'
import { InferActionTypes, BaseTThunk } from './redux-store'
import { UserType } from './../components/common/Types'
import { usersAPI } from '../api/usersAPI'
import { updateObjInArray } from '../utils/object-helpers'
import { Dispatch } from 'react'

let initialState = {
  users: [] as UserType[],
  pageSize: 10,
  totalUsersCount: 0,
  currentPage: 1,
  isFetching: false,
  followingInProgress: [] as number[], //array of users ids
  filter: {
    term: '',
    friend: null as null | boolean
  }
}

const usersReducer = (
  state = initialState,
  action: ActionTypes
): InitialStateUsersType => {
  switch (action.type) {
    case 'SM/USERS/FOLLOW':
      return {
        ...state,
        users: updateObjInArray(state.users, 'id', action.userId, {
          followed: true,
        }),
      }
    case 'SM/USERS/UNFOLLOW':
      return {
        ...state,
        users: updateObjInArray(state.users, 'id', action.userId, {
          followed: false,
        }),
      }
    case 'SM/USERS/SET_USERS':
      return {
        ...state,
        users: action.users,
      }

      case 'SM/USERS/SET_FILTER':
        return {
          ...state,
          filter: action.payload
        }

    case 'SM/USERS/SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.currentPage,
      }

    case 'SM/USERS/SET_TOTAL_USERS_COUNT':
      return {
        ...state,
        totalUsersCount: action.totalUsersCount,
      }

    case 'SM/USERS/TOGGLE_IS_FETCHING':
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case 'SM/USERS/TOGGLE_IS_FOLLOWING_PROGRESS':
      return {
        ...state,
        followingInProgress: action.isFetching
          ? [...state.followingInProgress, action.userId]
          : state.followingInProgress.filter((id) => id !== action.userId),
      }

    default:
      return state
  }
}

export const actionsOfUsers = {
  followSuccess: (userId: number) => ({ type: 'SM/USERS/FOLLOW', userId } as const),
  unfollowSuccess: (userId: number) => ({ type: 'SM/USERS/UNFOLLOW', userId } as const),
  setUsers: (users: UserType[]) => ({ type: 'SM/USERS/SET_USERS', users } as const),
  setFilter: (filter: FilterType) => ({ type: 'SM/USERS/SET_FILTER', payload: filter } as const),
  setCurrentPage: (currentPage: number) =>
    ({ type: 'SM/USERS/SET_CURRENT_PAGE', currentPage } as const),
  setTotalUsersCount: (totalUsersCount: number) =>
    ({ type: 'SM/USERS/SET_TOTAL_USERS_COUNT', totalUsersCount } as const),
  toggleIsFetching: (isFetching: boolean) =>
    ({ type: 'SM/USERS/TOGGLE_IS_FETCHING', isFetching } as const),
  toggleFollowingProgress: (isFetching: boolean, userId: number) =>
    ({ type: 'SM/USERS/TOGGLE_IS_FOLLOWING_PROGRESS', isFetching, userId } as const),
}

export const getUsers = (currentPage: number, pageSize: number, filter: FilterType): TThunk => {
  return async (dispatch) => {
    dispatch(actionsOfUsers.setCurrentPage(currentPage))
    dispatch(actionsOfUsers.toggleIsFetching(true))
    dispatch(actionsOfUsers.setFilter(filter))
    const data = await usersAPI.getUsers(currentPage, pageSize, filter.term, filter.friend)
    dispatch(actionsOfUsers.toggleIsFetching(false))
    dispatch(actionsOfUsers.setUsers(data.items))
    dispatch(actionsOfUsers.setTotalUsersCount(data.totalCount))
  }
}

const followUnfollowFlow = async (
  dispatch: TDispatch,
  userId: number,
  apiMethod: (userId: number) => Promise<APIResponseType>,
  actionCreator: (userId: number) => ActionTypes
) => {
  dispatch(actionsOfUsers.toggleFollowingProgress(true, userId))
  const data = await apiMethod(userId)
  if (data.resultCode === 0) {
    dispatch(actionCreator(userId))
  }
  dispatch(actionsOfUsers.toggleFollowingProgress(false, userId))
}
export const unfollow = (userId: number): TThunk => {
  return async (dispatch) => {
    const unfollowSuccess = actionsOfUsers.unfollowSuccess
    await followUnfollowFlow(
      dispatch,
      userId,
      usersAPI.unfollow,
      unfollowSuccess
    )
  }
}
export const follow = (userId: number): TThunk => {
  return async (dispatch) => {
    const followSuccess = actionsOfUsers.followSuccess
    await followUnfollowFlow(dispatch, userId, usersAPI.follow, followSuccess)
  }
}
export default usersReducer

export type InitialStateUsersType = typeof initialState
export type FilterType = typeof initialState.filter
type ActionTypes = InferActionTypes<typeof actionsOfUsers>
type TThunk = BaseTThunk<ActionTypes>
type TDispatch = Dispatch<ActionTypes>
