import { PropsWithChildren, useRef } from 'react'
import { MessageProvider, MessageRef } from '.'
import { ConfigContext } from './provider'

export function ConfigProvider(props: PropsWithChildren) {
  const messageRef = useRef<MessageRef>(null)
  const { children } = props

  return (
    <div>
      <ConfigContext.Provider value={{ messageRef }}>
        <MessageProvider ref={messageRef}></MessageProvider>
        {children}
      </ConfigContext.Provider>
    </div>
  )
}
