import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '~/assets/logo.svg'
import { ConfirmModal } from '~/components/ui/ConfirmModal'
import { quickLinks } from '~/constants/links'
import { LogOut } from 'lucide-react'
import { Button } from '~/components/ui/Button'
import { cn } from '~/lib/cn'
import { useLogout } from './hooks/useLogout'

export const Header = () => {
  const [exitModalOpen, setExitModalOpen] = useState(false)
  const { logout } = useLogout()

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg-surface shadow-sm">
        <div className="container-app flex h-16 flex-wrap items-center justify-between gap-4 md:gap-6">
          <Link to="/" className="link-brand">
            <img src={logo} alt="" className="h-8 w-8" />
            Розклади ЦПТО
          </Link>

          <nav className="flex w-full flex-1 justify-center md:w-auto">
            <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-1 p-0">
              {quickLinks.map((item) => (
                <li key={item.link}>
                  <NavLink
                    to={item.link}
                    end={item.link === '/'}
                    className={({ isActive }) => cn('nav-link', isActive && 'nav-link--active')}
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Button variant="ghost" onClick={() => setExitModalOpen(true)} className="shrink-0 gap-2">
            <LogOut className="h-4 w-4" />
            Вихід
          </Button>
        </div>
      </header>

      <ConfirmModal
        open={exitModalOpen}
        title="Вихід"
        description="Ви точно бажаєте вийти?"
        confirmText="Вийти"
        variant="danger"
        onConfirm={() => void logout(() => setExitModalOpen(false))}
        onClose={() => setExitModalOpen(false)}
      />
    </>
  )
}
