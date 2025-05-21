import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export interface AppType {
  id: number
  name: string
  icon: IconDefinition
  color: string
  description: string
  category: string
}
