import { User } from '@/stores/user' // Adjust path as needed

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $user: User;
  }
}

declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  