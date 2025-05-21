import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export type AppPermission =
  | "read:user"
  | "write:user"
  | "read:documents"
  | "write:documents"
  | "read:finance"
  | "write:finance"
  | "admin"

export interface AppManifest {
  id: number
  name: string
  description: string
  version: string
  author: {
    name: string
    email?: string
    url?: string
  }
  category: string
  icon: string // FontAwesome icon name
  color: string
  permissions: AppPermission[]
  entryPoint: string
  isSystem?: boolean
  requiredFeatures?: string[]
  translations?: {
    [key: string]: {
      name: string
      description: string
    }
  }
  lastUpdated?: string
}

export interface AppWithIcon extends AppManifest {
  iconDef: IconDefinition
}
