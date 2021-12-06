/* eslint-disable no-debugger */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './App.css'
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from './config'
import { Home } from './components/Home/Home'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { RegisterStep2 } from './components/Register/RegisterStep2'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './store/userSlice'
import { Logo } from './icons/logo'
import { Box } from '@mui/system'
import { CircularProgress, Typography } from '@mui/material'
import { TopBar } from './components/Header/TopBar'
import { Landing } from './components/Landing/Landing'

const firebaseAppAuth = firebase.auth()

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');

const providers = {
  googleProvider: googleProvider,
  facebookProvider: new firebase.auth.FacebookAuthProvider(),
}

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth,
})

const App = ({
  /** These props are provided by withFirebaseAuth HOC */
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  // signInWithGithub,
  // signInWithTwitter,
  // signInAnonymously,
  signOut,
  // setError,
  user,
  error,
  loading,
}: any) => {

  const [authPage, setAuthPage] = useState('landing')
  const [intro, setInto] = useState(true)

  const currentUser = useSelector((state: any) => state.user.value)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user && user.uid) {
      firebase.firestore().collection("users").doc(user.uid)
        .get()
        .then((doc: any) => {
          if (doc.exists) {
            doc.ref.onSnapshot(function (querySnapshot: any) {
              dispatch(setUser({
                ...querySnapshot.data()
              }))
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!")
            firebase.firestore().collection("users").doc(user.uid).set({
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid
            })
            dispatch(setUser(user))

          }
        }).catch((error: any) => {
          console.log("Error getting document:", error)
        });
    }
  }, [user])

  useEffect(() => {
    setTimeout(() => {
      setInto(false)
    }, 2000)
  }, [])

  const signOutFromApp = () => {
    signOut()
    dispatch(setUser(undefined))
  }

  return intro ? (<Box sx={{ textAlign: 'center', mt: 6 }}>
    <Logo sx={{ width: 120, height: 120, m: 8, ml: 'auto', mr: 'auto' }} />
    <Typography variant="h3" color="primary" >Photo Rater</Typography>
    <CircularProgress sx={{ display: 'block', m: 'auto', mt: 6 }} />
  </Box>) : (
    <div className="AppWrapper">
      <TopBar signOut={signOutFromApp} />
      {currentUser && currentUser.complete && <Home />}
      {currentUser && !currentUser.complete && <RegisterStep2 uid={currentUser.uid} />}
      {!currentUser && authPage == "landing"
        && <Landing
          login={() => setAuthPage('login')}
        />}

      {!currentUser && authPage == "login"
        && <Login
          signInWithGoogle={signInWithGoogle}
          signInWithFacebook={signInWithFacebook}
          signUp={() => setAuthPage('register')}
          error={error}
          onSubmit={signInWithEmailAndPassword}
        />}

      {!currentUser && authPage == "register"
        && <Register
          onSubmit={createUserWithEmailAndPassword}
          login={() => setAuthPage('login')} />}

    </div>
  )
}

App.propTypes = {
  signInWithEmailAndPassword: PropTypes.func,
  createUserWithEmailAndPassword: PropTypes.func,
  signInWithGoogle: PropTypes.func,
  signInWithFacebook: PropTypes.func,
  // signInWithGithub: PropTypes.object,
  // signInWithTwitter: PropTypes.object,
  // signInAnonymously: PropTypes.object,
  signOut: PropTypes.func,
  // setError: PropTypes.object,
  user: PropTypes.object,
  error: PropTypes.string,
  loading: PropTypes.bool,
}

export default createComponentWithAuth(App)
