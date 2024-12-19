import { CSSProperties, FC, forwardRef, ReactNode, useMemo } from 'react'
import useStore from './useStore'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import './index.scss'
import { createPortal } from 'react-dom'
import useTimer from './useTimer'

export type Position = 'top' | 'bottom'

export interface MessageProps {
  style?: CSSProperties
  className?: string | string[]
  content: ReactNode
  duration?: number
  id?: number
  position?: Position
  onClose?: (id: number) => void
}

export interface MessageRef {
  add: (props: MessageProps) => void
  clear: () => void
  remove: (id: number) => void
  update: (id: number, props: MessageProps) => void
}

const MessageItem: FC<MessageProps> = (item) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    remove: item.onClose!,
    id: item.id as number,
    duration: item.duration,
  })
  return (
    <div className="message-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {item.content}
    </div>
  )
}
export const MessageProvider = forwardRef<MessageRef>((_props, ref) => {
  const { message, add, remove, update, clear } = useStore('top')

  // useImperativeHandle 执行时机不对，所以采用直接赋值的方式
  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return { add, clear, update, remove }
  //   },
  //   [add, clear, update, remove],
  // )
  if ('current' in ref!) {
    ref.current = { add, clear, update, remove }
  }

  const positions = Object.keys(message) as Position[]
  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((direction) => {
        return (
          <TransitionGroup className={`message-wrapper-${direction}`} key={direction}>
            {message[direction].map((item) => {
              return (
                <CSSTransition key={item.id} timeout={1000} classNames="message">
                  <MessageItem {...item} onClose={remove} />
                </CSSTransition>
              )
            })}
          </TransitionGroup>
        )
      })}
    </div>
  )

  const el = useMemo(() => {
    const el = document.createElement('div')
    el.className = 'wrapper'

    document.body.appendChild(el)
    return el
  }, [])

  return createPortal(messageWrapper, el) // 将消息组件挂载到body上
})
