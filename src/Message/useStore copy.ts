import { useState } from 'react'
import { Position, MessageProps } from '.'

type MessageList = {
  top: MessageProps[]
  bottom: MessageProps[]
}

const initialMessage = () => ({
  top: [],
  bottom: [],
})

function useStore(defaultPosition: Position) {
  console.log('useStore')

  const [message, setMessage] = useState<MessageList>({ ...initialMessage() })

  return {
    message,
    add: (messageProps: MessageProps) => {
      const id = getId(messageProps)

      setMessage((prev) => {
        // 根据id查找有没有相同的，如果有则不添加
        if (messageProps?.id) {
          const position = getPosition(prev, id)
          if (position) return prev
        }
        const position = messageProps.position || defaultPosition
        const isTop = position.includes('top')

        const message = isTop
          ? [{ ...messageProps, id }, ...(prev[position] ?? [])]
          : [...(prev[position] ?? []), { ...messageProps, id }]

        return {
          ...prev,
          [position]: message,
        }
      })
      return id
    },
    update: (id: MessageProps['id'], messageProps: MessageProps) => {
      if (!id) return
      setMessage((prev) => {
        const nextMessage = { ...prev }
        const { position, index } = findMessage(nextMessage, id)
        if (position && index !== -1) {
          nextMessage[position][index] = { ...nextMessage[position][index], ...messageProps }
        }
        return nextMessage
      })
    },
    remove: (id: MessageProps['id']) => {
      if (!id) return

      setMessage((prev) => {
        const nextMessage = { ...prev }
        const { position, index } = findMessage(nextMessage, id)
        if (position && index !== -1) {
          nextMessage[position].splice(index, 1)
        }
        return nextMessage
      })
    },
    clear: () => {
      setMessage(initialMessage())
    },
  }
}

function createCounter() {
  let id = 0
  return () => ++id
}
const counter = createCounter()
function getId(messageProps: MessageProps): number {
  if (messageProps?.id) {
    return messageProps.id
  }
  return counter()
}

/**
 * 获取消息的位置
 * @param messageList
 * @param id
 * @returns
 */
function getPosition(messageList: MessageList, id: MessageProps['id']) {
  for (const [position, list] of Object.entries(messageList)) {
    if (list.find((record) => record.id === id)) {
      return position as Position
    }
  }
  return null
}

/**
 * 获取消息的位置和索引
 * @param messageList
 * @param id
 * @returns
 */
function findMessage(messageList: MessageList, id: MessageProps['id']) {
  const position = getPosition(messageList, id)
  const index = position ? messageList[position].findIndex((record) => record.id === id) : -1
  return { position, index }
}

export default useStore
