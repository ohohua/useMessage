import { createContext, RefObject } from 'react'
import { MessageRef } from '.'

interface ConfigProviderProps {
  messageRef?: RefObject<MessageRef>
}

export const ConfigContext = createContext<ConfigProviderProps>({})
