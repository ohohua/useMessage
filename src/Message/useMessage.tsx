import { useContext } from 'react'
import { ConfigContext } from './provider'

export function useMessage() {
  const { messageRef } = useContext(ConfigContext)

  if (!messageRef) {
    throw new Error('messageRef is null')
  }
  return messageRef.current
}
