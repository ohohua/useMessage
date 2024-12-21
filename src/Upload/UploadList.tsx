export interface UploadFile {
  uid: string
  size: number
  name: string
  status: 'ready' | 'uploading' | 'success' | 'error'
  percent?: number
  raw?: File
  response?: unknown
  error?: unknown
}

interface UploadListProps {
  fileList: UploadFile[]
  onRemove: (file: UploadFile) => void
}

export const UploadList: React.FC<UploadListProps> = (props) => {
  const { fileList, onRemove } = props

  return (
    <ul>
      {fileList.map((file) => (
        <li key={file.uid}>
          <span>{file.name}</span>
          <span>{file.status}</span>
          <span onClick={() => onRemove(file)}>X</span>
        </li>
      ))}
    </ul>
  )
}
