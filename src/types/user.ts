import firebase from '../config'

export interface User {
  age?: number
  complete?: boolean
  displayName?: string
  photoURL?: string
  email?: string
  gender?: string
  lastVotedAt?: firebase.firestore.Timestamp
  newVotes?: number
  onBoarding?: boolean
  points?: number
  showGender?: string
  uid?: string
  messagingToken?: string
  blocks?: string[]
  feedback?: boolean
}

export interface UserVote {
  id?: string
  rate?: number
  comment?: string
  chips?: string[]
  ratedAt?: firebase.firestore.Timestamp
}
