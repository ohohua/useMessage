import { ConfigProvider } from './Message/ConfigProvider'
import { useMessage } from './Message/useMessage'

function Aaa() {
  const message = useMessage()
  return (
    <div>
      <button onClick={() => message?.add({ content: '你好' })}>message</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <ConfigProvider>
        <Aaa />
      </ConfigProvider>
    </div>
  )
}

export default App
