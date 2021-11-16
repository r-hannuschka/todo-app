import 'reflect-metadata'
import { Registry, Route, Router } from '@app/core/utils'
import { Home, Impressum } from './pages';
import { AddTodoComponent } from './pages/add-todo';

const AppRoutes: Route[] = [{
  path: 'todos',
  component: Home 
}, {
  path: 'todos/add',
  component: AddTodoComponent
}, {
  path: 'impressum',
  component: Impressum
}]

export class App {
  private root: HTMLElement | null;
  private router: Router | null;

  constructor() {
    this.router = Registry.resolve(Router)
    this.root = document.querySelector('main[data-app-root]')
  }

  init() {
    this.initializeMenu()

    if (this.router) {
      this.router.registerRoute(AppRoutes)
      this.router.change().subscribe((page) => this.renderPage(page))
      this.router.navigate('todos')
    }
  }

  /** 
   * @description initialize menu
   */
  private initializeMenu() {
    const menu = document.querySelector('header [data-app-menu]')

    menu?.addEventListener('click', (event: Event) => {
      event.stopPropagation()
      event.preventDefault()

      const menuItemData = (event.target as HTMLElement).dataset
      if (menuItemData.routerLink !== void 0) {
        this.router?.navigate(menuItemData.routerLink.trim())
      }
    })
  }

  /**
   * @description render given page to content section
   */
  private async renderPage(page: any) {
    while (this.root?.firstChild && this.root.removeChild(this.root.firstChild))

    await page.init()
    this.root?.appendChild(page.render())
  }

  static start() {
    new App().init()
  }
}

App.start()
