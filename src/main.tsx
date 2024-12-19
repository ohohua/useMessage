import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ClickToComponent } from 'click-to-react-component'

// ⌥ + 鼠标左键, 点击组件, 查看组件代码

createRoot(document.getElementById('root')!).render(
  <>
    <ClickToComponent />
    <App />
  </>,
)
