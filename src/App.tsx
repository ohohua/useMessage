import { ConfigProvider } from './Message/ConfigProvider'
import { useMessage } from './Message/useMessage'
import { Button } from '@/components/ui/button'
import Upload, { UploadProps } from './Upload'

function Aaa() {
  const message = useMessage()
  return (
    <div>
      <Button variant="outline" onClick={() => message?.add({ content: '你好' })}>
        message
      </Button>
    </div>
  )
}
function App() {
  const props: UploadProps = {
    name: 'file',
    action: 'http://localhost:3333/upload',
    beforeUpload(file) {
      if (file.name.includes('1.image')) {
        return false
      }
      return true
    },
    onSuccess(ret) {
      console.log('onSuccess', ret)
    },
    onError(err) {
      console.log('onError', err)
    },
    onProgress(percentage, file) {
      console.log('onProgress', percentage)
    },
    onChange(file) {
      console.log('onChange', file)
    },
  }
  return (
    <div>
      <ConfigProvider>
        <Aaa />
        <Upload {...props}>
          <Button variant="outline">上传</Button>
        </Upload>
      </ConfigProvider>
    </div>
  )
}

export default App
