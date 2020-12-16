import React, { FC } from 'react'
import Pagination from '../common/pagination/Pagination'
import { UserType } from '../common/Types'
import User from './User'

type Props = {
  users: UserType[]
  followingInProgress: number[]
  currentPage: number
  pageSize: number
  totalUsersCount: number

  onPageChanged: (pageNr: number) => void

  unfollow: (userId: number) => void
  follow: (userId: number) => void
}

let Users: FC<Props> = (props) => {
  return (
    <div>
      {props.users.map((u) => (
        <User
          key={u.id}
          user={u}
          followingInProgress={props.followingInProgress}
          unfollow={props.unfollow}
          follow={props.follow}
        />
      ))}
      <Pagination
        pageSize={props.pageSize}
        totalUsersCount={props.totalUsersCount}
        onPageChanged={props.onPageChanged}
        currentPage={props.currentPage}
      />
    </div>
  )
}

export default Users
