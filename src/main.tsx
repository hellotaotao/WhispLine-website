import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UpdatesPage from './updates/UpdatesPage.tsx'
import { parseRoute } from './i18n'
import { getPreviewLayout } from './preview'

const route = parseRoute(window.location.pathname) ?? { locale: 'en', page: 'home' }
const preview = route.page === 'home' ? getPreviewLayout(window.location.search ?? '') : null
const page = route.page === 'home'
  ? <App locale={route.locale} preview={preview} />
  : <UpdatesPage page={route.page} locale={route.locale} />
const root = document.getElementById('root')!
const app = <StrictMode>{page}</StrictMode>
document.documentElement.lang = route.locale === 'zh' ? 'zh-CN' : 'en'

if (root.hasAttribute('data-prerendered') && preview === null) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
