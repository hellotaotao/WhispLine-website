import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UpdatesPage from './updates/UpdatesPage.tsx'

const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/'
const page = path === '/updates' || path === '/changelog'
  ? <UpdatesPage page={path === '/updates' ? 'updates' : 'changelog'} />
  : <App />
const root = document.getElementById('root')!
const app = <StrictMode>{page}</StrictMode>

if (root.hasAttribute('data-prerendered')) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
