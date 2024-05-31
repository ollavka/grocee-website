import { AtLeastOne } from '../types'

export type ModalStates = Record<
  'burgerMenu' | 'searchBar' | 'confirmModal' | 'bottomModal' | 'sideBar',
  {
    state: boolean
    onCloseDesktop?: () => void
    onCloseMobile?: () => void
  }
>

type Options = {
  fade?: 'showHeader' | 'full'
  headerOffsetRight?: number
}

const fadeSelectors = {
  burgerMenu: '.burgermenu-bottom-modal-fade-container',
  searchBar: '.searchbar-fade-container',
  bottomModal: '.burgermenu-bottom-modal-fade-container',
  sideBar: '.sidebar-fade-container',
}

class ModalService {
  private modalsStates: ModalStates = {
    burgerMenu: {
      state: false,
    },
    searchBar: {
      state: false,
    },
    confirmModal: {
      state: false,
    },
    bottomModal: {
      state: false,
    },
    sideBar: {
      state: false,
    },
  }

  clearFade() {
    for (const fadeContainer of Object.values(fadeSelectors)) {
      document.querySelector(fadeContainer)?.classList.remove('fade')
    }
  }

  clearFadeZIndex() {
    for (const fadeContainer of Object.values(fadeSelectors)) {
      document.querySelector(fadeContainer)?.classList.remove('z-10', 'z-20')
    }
  }

  clearFullFade() {
    for (const fadeContainer of Object.values(fadeSelectors)) {
      document.querySelector(fadeContainer)?.classList.remove('z-10', 'z-20', 'fade')
    }
  }

  toggleFade(options?: Options) {
    const openedModal = Object.entries(this.modalsStates).find(([, value]) => !!value.state)?.[0]

    if (openedModal && openedModal in fadeSelectors) {
      const zIndex = options?.fade === 'full' ? 'z-20' : 'z-10'
      document
        .querySelector(fadeSelectors[openedModal as keyof typeof fadeSelectors])
        ?.classList.add(zIndex, 'fade')

      return
    }

    this.clearFade()
  }

  private handleModalsOpen(options?: Options) {
    const isSomeModalOpen = this.isSomeModalOpen()
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const header = document.querySelector('.main-header-navigation') as HTMLElement

    if (isSomeModalOpen) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.classList.add('cancelScroll')
      this.toggleFade(options)
    } else {
      document.body.style.paddingRight = '0'
      document.body.classList.remove('cancelScroll')
      this.clearFade()
    }

    if (isSomeModalOpen && options?.headerOffsetRight !== undefined) {
      header.style.right = `${(options.headerOffsetRight ?? 0) + scrollbarWidth}px`
    } else {
      header.style.right = ''
    }
  }

  changeModalState(name: keyof typeof this.modalsStates, state: boolean, options?: Options) {
    this.modalsStates[name].state = state

    this.handleModalsOpen(options)
  }

  addActionOnScreenChange(
    name: keyof typeof this.modalsStates,
    action: AtLeastOne<ModalStates[keyof ModalStates]>,
  ) {
    this.modalsStates[name] = { ...this.modalsStates[name], ...action }
  }

  getModalStates() {
    return this.modalsStates
  }

  isSomeModalOpen() {
    return Object.values(this.modalsStates).some(({ state }) => state === true)
  }
}

const modalService = new ModalService()

export default modalService
