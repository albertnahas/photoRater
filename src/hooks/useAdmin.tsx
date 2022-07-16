import { useEffect, useState } from 'react'
import firebase from '../config'
import { Photo } from '../types/photo'
import { useConfirm } from 'material-ui-confirm'

export type sortUsers = 'lastVotedAt' | 'displayName' | 'points'

const useAdmin = () => {
  const [usersLoaded, setUsersLoaded] = useState(false)
  const [users, setUsers] = useState<userstate[]>([])
  const [sortBy, setSortBy] = useState<sortUsers>('points')

  const confirm = useConfirm()

  useEffect(() => {
    const usersUnsubscribe = firebase
      .firestore()
      .collection(`users`)
      .orderBy(sortBy, 'desc')
      .onSnapshot((querySnapshot: any) => {
        const userusers: userstate[] = []
        querySnapshot.forEach((doc: userstate) => {
          userusers.push(doc)
        })
        setUsers(userusers)
        setUsersLoaded(true)
      })
    return () => {
      usersUnsubscribe()
    }
  }, [sortBy])

  const updateUser = (props: any, id: string) => {
    return firebase
      .firestore()
      .collection(`users`)
      .doc(id)
      .update({
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...props
      })
  }

  const deleteUser = (id?: string) => {
    confirm({ description: 'This action is permanent!' })
      .then(() => {
        firebase.firestore().collection(`users`).doc(id).delete()
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  return {
    users,
    usersLoaded,
    userUtils: {
      updateUser,
      deleteUser
    },
    sortBy,
    setSortBy
  }
}

export interface userstate {
  id?: string
  data: () => Photo
}

export default useAdmin
