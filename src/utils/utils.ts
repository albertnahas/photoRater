import _ from 'lodash'
import { Photo } from '../types/photo'
import firebase from '../config'

const storage = firebase.storage()

export const tags: string[] = [
  'amiable',
  'assertive',
  'attractive',
  'beautiful',
  'calm',
  'clean',
  'comfortable',
  'confident',
  'engaged',
  'exuberant',
  'forthcoming',
  'friendly',
  'gentle',
  'genuine',
  'happy',
  'honest',
  'humble',
  'intelligent',
  'interested',
  'interesting',
  'joyful',
  'likable',
  'neat',
  'open',
  'peaceful',
  'respectful',
  'self-assured',
  'smiling',
  'stylish',
  'tidy',
  'trusting',
  'trustworthy',
  'upbeat',
  'well-dressed',
  'agitated',
  'arrogant',
  'closed',
  'dirty',
  'disheveled',
  'dishonest',
  'disingenuous',
  'disinterested',
  'disrespectful',
  'frowning',
  'hateful',
  'irritated',
  'mean',
  'messy',
  'miserable',
  'removed',
  'rude',
  'sneaky',
  'snotty',
  'standoffish',
  'stuck-up',
  'suspicious',
  'ugly',
  'unattractive',
  'uncomfortable',
  'unhappy'
]

export const reportReasons = [
  'Fake profile/Spam',
  'Inappropriate photo',
  'Restricted content',
  'Sexually explicit',
  'Underage user',
  'Illegal content',
  'Off-topic'
]

export const getResizedImageUrl = async (photo?: Photo) => {
  return await storage
    .ref('images/' + photo?.userId + '/resized/' + photo?.resizedImageName)
    .getDownloadURL()
}
export const getImageUrl = async (photo?: Photo) => {
  return await storage
    .ref('images/' + photo?.userId + '/' + photo?.imageName)
    .getDownloadURL()
}

export const showGenderLabel = (gender?: string) => {
  if (gender === 'male') return 'males'
  if (gender === 'female') return 'females'
  return 'males and females'
}

export const generateUUID = () => {
  let d = new Date().getTime() // Timestamp
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export const getResizedName = (fileName: string, dimensions = '600x600') => {
  const extIndex = fileName.lastIndexOf('.')
  const ext = fileName.substring(extIndex)
  return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`
}

export const multipleMax = (arr: any[], compare: string) => {
  var groups = _.groupBy(arr, compare)
  var keys = _.keys(groups)
  var max = _.max(keys) || ''
  return groups[max]
}

export const sameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth()
  )
}
export const isToday = (d: Date) => {
  const today = new Date()
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth()
  )
}

export const isiOS = () => {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export const themeShadows: [
  'none',
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
] = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.12),0px 1px 1px 0px rgba(0,0,0,0.1),0px 1px 3px 0px rgba(0,0,0,00.07)',
  '0px 3px 1px -2px rgba(0,0,0,0.12),0px 2px 2px 0px rgba(0,0,0,0.1),0px 1px 5px 0px rgba(0,0,0,00.07)',
  '0px 3px 3px -2px rgba(0,0,0,0.12),0px 3px 4px 0px rgba(0,0,0,0.1),0px 1px 8px 0px rgba(0,0,0,00.07)',
  '0px 2px 4px -1px rgba(0,0,0,0.12),0px 4px 5px 0px rgba(0,0,0,0.1),0px 1px 10px 0px rgba(0,0,0,00.07)',
  '0px 3px 5px -1px rgba(0,0,0,0.12),0px 5px 8px 0px rgba(0,0,0,0.1),0px 1px 14px 0px rgba(0,0,0,00.07)',
  '0px 3px 5px -1px rgba(0,0,0,0.12),0px 6px 10px 0px rgba(0,0,0,0.1),0px 1px 18px 0px rgba(0,0,0,00.07)',
  '0px 4px 5px -2px rgba(0,0,0,0.12),0px 7px 10px 1px rgba(0,0,0,0.1),0px 2px 16px 1px rgba(0,0,0,00.07)',
  '0px 5px 5px -3px rgba(0,0,0,0.12),0px 8px 10px 1px rgba(0,0,0,0.1),0px 3px 14px 2px rgba(0,0,0,00.07)',
  '0px 5px 6px -3px rgba(0,0,0,0.12),0px 9px 12px 1px rgba(0,0,0,0.1),0px 3px 16px 2px rgba(0,0,0,00.07)',
  '0px 6px 6px -3px rgba(0,0,0,0.12),0px 10px 14px 1px rgba(0,0,0,0.1),0px 4px 18px 3px rgba(0,0,0,00.07)',
  '0px 6px 7px -4px rgba(0,0,0,0.12),0px 11px 15px 1px rgba(0,0,0,0.1),0px 4px 20px 3px rgba(0,0,0,00.07)',
  '0px 7px 8px -4px rgba(0,0,0,0.12),0px 12px 17px 2px rgba(0,0,0,0.1),0px 5px 22px 4px rgba(0,0,0,00.07)',
  '0px 7px 8px -4px rgba(0,0,0,0.12),0px 13px 19px 2px rgba(0,0,0,0.1),0px 5px 24px 4px rgba(0,0,0,00.07)',
  '0px 7px 9px -4px rgba(0,0,0,0.12),0px 14px 21px 2px rgba(0,0,0,0.1),0px 5px 26px 4px rgba(0,0,0,00.07)',
  '0px 8px 9px -5px rgba(0,0,0,0.12),0px 15px 22px 2px rgba(0,0,0,0.1),0px 6px 28px 5px rgba(0,0,0,00.07)',
  '0px 8px 10px -5px rgba(0,0,0,0.12),0px 16px 24px 2px rgba(0,0,0,0.1),0px 6px 30px 5px rgba(0,0,0,00.07)',
  '0px 8px 11px -5px rgba(0,0,0,0.12),0px 17px 26px 2px rgba(0,0,0,0.1),0px 6px 32px 5px rgba(0,0,0,00.07)',
  '0px 9px 11px -5px rgba(0,0,0,0.12),0px 18px 28px 2px rgba(0,0,0,0.1),0px 7px 34px 6px rgba(0,0,0,00.07)',
  '0px 9px 12px -6px rgba(0,0,0,0.12),0px 19px 29px 2px rgba(0,0,0,0.1),0px 7px 36px 6px rgba(0,0,0,00.07)',
  '0px 10px 13px -6px rgba(0,0,0,0.12),0px 20px 31px 3px rgba(0,0,0,0.1),0px 8px 38px 7px rgba(0,0,0,00.07)',
  '0px 10px 13px -6px rgba(0,0,0,0.12),0px 21px 33px 3px rgba(0,0,0,0.1),0px 8px 40px 7px rgba(0,0,0,00.07)',
  '0px 10px 14px -6px rgba(0,0,0,0.12),0px 22px 35px 3px rgba(0,0,0,0.1),0px 8px 42px 7px rgba(0,0,0,00.07)',
  '0px 11px 14px -7px rgba(0,0,0,0.12),0px 23px 36px 3px rgba(0,0,0,0.1),0px 9px 44px 8px rgba(0,0,0,00.07)',
  '0px 11px 15px -7px rgba(0,0,0,0.12),0px 24px 38px 3px rgba(0,0,0,0.1),0px 9px 46px 8px rgba(0,0,0,00.07)'
]

const getPWADisplayMode = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if (document.referrer.startsWith('android-app://')) {
    return 'twa'
  } else if ((navigator as any).standalone || isStandalone) {
    return 'standalone'
  }
  return 'browser'
}
