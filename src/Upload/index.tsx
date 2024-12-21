import axios from 'axios'
import React, { PropsWithChildren } from 'react'

export interface UploadProps extends PropsWithChildren {
  action: string // 上传路径
  headers?: { [key: string]: unknown } // 请求头
  name?: string // 上传文件字段名
  data?: { [key: string]: unknown } // 上传文件额外参数
  withCredentials?: boolean // 是否携带 cookie
  accept?: string // 接受上传的文件类型
  multiple?: boolean // 是否支持多选文件
  beforeUpload?: (file: File) => boolean | Promise<File> // 上传前的钩子函数
  onProgress?: (percentage: number, file: File) => void // 上传进度回调
  onSuccess?: (data: unknown, file: File) => void // 上传成功回调
  onError?: (err: Error, file: File) => void // 上传失败回调
  onChange?: (file: File) => void // 文件状态改变回调
}

const Upload: React.FC<UploadProps> = (props) => {
  const {
    action,
    headers,
    name,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
  } = props

  const fileRef = React.useRef<HTMLInputElement>(null)

  // 触发点击上传
  const handleClick = () => {
    fileRef.current?.click()
  }

  // 选择文件
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    uploadFiles(files)
    fileRef.current!.value = ''
  }

  // 循环调用上传接口
  const uploadFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!beforeUpload) {
        post(file)
      } else {
        const result = beforeUpload(file)
        if (result && result instanceof Promise) {
          result.then((processFile) => {
            post(processFile)
          })
        } else if (result !== false) {
          post(file)
        }
      }
    })
  }

  const post = (file: File) => {
    const formData = new FormData()

    formData.append(name || 'file', file)
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] as string)
      })
    }
    axios
      .post(action, formData, {
        headers: {
          ...headers,
          'Content-type': 'multipart/form-data',
        },
        withCredentials,
        onUploadProgress: (e) => {
          const percentage = Math.round((e.loaded * 100) / e.total!) || 0
          if (percentage < 100) {
            if (onProgress) {
              onProgress(percentage, file)
            }
          }
        },
      })
      .then((resp) => {
        onSuccess?.(resp.data, file)
        onChange?.(file)
      })
      .catch((err) => {
        onError?.(err, file)
        onChange?.(file)
      })
  }

  return (
    <div className="upload-component">
      <div className="inline-block" onClick={handleClick}>
        {children}
        <input
          type="file"
          className="hidden"
          accept={accept}
          ref={fileRef}
          onChange={handleFileChange}
          multiple={multiple}
        />
      </div>
    </div>
  )
}

export default Upload
