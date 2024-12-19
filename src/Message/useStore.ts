import { useState, useCallback } from 'react'
import { Position, MessageProps } from '.'

type MessageList = {
  top: MessageProps[]
  bottom: MessageProps[]
}

const initialMessage = (): MessageList => ({
  top: [],
  bottom: [],
})

function useStore(defaultPosition: Position) {
  console.log('useStore')

  const [message, setMessage] = useState<MessageList>(initialMessage)

  // 生成一个唯一的ID
  const createCounter = useCallback(() => {
    let id = 0
    return () => ++id
  }, [])

  const counter = createCounter()

  // 获取消息ID
  const getId = useCallback(
    (messageProps: MessageProps) => {
      return messageProps?.id || counter()
    },
    [counter],
  )

  // 获取消息的位置
  const getPosition = useCallback((messageList: MessageList, id: MessageProps['id']) => {
    for (const [position, list] of Object.entries(messageList)) {
      if (list.find((record) => record.id === id)) {
        return position as Position
      }
    }
    return null
  }, [])

  // 查找消息的位置和索引
  const findMessage = useCallback(
    (messageList: MessageList, id: MessageProps['id']) => {
      const position = getPosition(messageList, id)
      const index = position ? messageList[position].findIndex((record) => record.id === id) : -1
      return { position, index }
    },
    [getPosition],
  )

  const add = useCallback(
    (messageProps: MessageProps) => {
      const id = getId(messageProps)

      setMessage((prev) => {
        // 检查是否已经存在相同id的消息
        if (messageProps?.id && getPosition(prev, id)) {
          return prev
        }

        const position = messageProps.position || defaultPosition
        const isTop = position.includes('top')

        const newMessage = {
          ...messageProps,
          id,
        }
        return {
          ...prev,
          [position]: isTop
            ? [newMessage, ...(prev[position] || [])]
            : [...(prev[position] || []), newMessage],
        }
      })

      return id
    },
    [getId, getPosition, defaultPosition],
  )

  const update = useCallback(
    (id: MessageProps['id'], messageProps: MessageProps) => {
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
    [findMessage],
  )

  const remove = useCallback(
    (id: MessageProps['id']) => {
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
    [findMessage],
  )

  const clear = useCallback(() => {
    setMessage(initialMessage())
  }, [])

  return {
    message,
    add,
    update,
    remove,
    clear,
  }
}

export default useStore
