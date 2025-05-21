import {
  faHome,
  faFileLines,
  faUser,
  faBell,
  faChartColumn,
  faCalendar,
  faFileExcel,
  faCommentDots,
  faEnvelope,
  faGear,
  faBolt,
  faDatabase,
  faFileAlt,
  faBriefcase,
  faChartPie,
  faUsers,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons"
import type { AppWithIcon } from "@/types/app-manifest"

// Map of icon names to FontAwesome icon definitions
const iconMap: Record<string, any> = {
  faHome: faHome,
  faFileLines: faFileLines,
  faUser: faUser,
  faBell: faBell,
  faChartColumn: faChartColumn,
  faCalendar: faCalendar,
  faFileExcel: faFileExcel,
  faCommentDots: faCommentDots,
  faEnvelope: faEnvelope,
  faGear: faGear,
  faBolt: faBolt,
  faDatabase: faDatabase,
  faFileAlt: faFileAlt,
  faBriefcase: faBriefcase,
  faChartPie: faChartPie,
  faUsers: faUsers,
  faCreditCard: faCreditCard,
}

// Import manifests statically
import ercManifest from "@/apps/erc/manifest.json"
import reProcurementManifest from "@/apps/re-procurement/manifest.json"
import profileManifest from "@/apps/profile/manifest.json"
import powerPurchaseManifest from "@/apps/power-purchase/manifest.json"
import analyticsDashboardManifest from "@/apps/analytics-dashboard/manifest.json"
import calendarManifest from "@/apps/calendar/manifest.json"
import documentManagerManifest from "@/apps/document-manager/manifest.json"
import messagingManifest from "@/apps/messaging/manifest.json"
import emailClientManifest from "@/apps/email-client/manifest.json"
import systemSettingsManifest from "@/apps/system-settings/manifest.json"
import energyOptimizerManifest from "@/apps/energy-optimizer/manifest.json"
import databaseExplorerManifest from "@/apps/database-explorer/manifest.json"
import contractManagementManifest from "@/apps/contract-management/manifest.json"
import projectTrackerManifest from "@/apps/project-tracker/manifest.json"
import financialReportsManifest from "@/apps/financial-reports/manifest.json"
import teamManagementManifest from "@/apps/team-management/manifest.json"
import paymentPortalManifest from "@/apps/payment-portal/manifest.json"

// Load app manifests and attach icon definitions
export function loadApps(): AppWithIcon[] {
  // Use statically imported manifests
  const manifests = [
    ercManifest,
    reProcurementManifest,
    profileManifest,
    powerPurchaseManifest,
    analyticsDashboardManifest,
    calendarManifest,
    documentManagerManifest,
    messagingManifest,
    emailClientManifest,
    systemSettingsManifest,
    energyOptimizerManifest,
    databaseExplorerManifest,
    contractManagementManifest,
    projectTrackerManifest,
    financialReportsManifest,
    teamManagementManifest,
    paymentPortalManifest,
  ]

  // Attach icon definitions to each manifest
  return manifests.map((manifest) => ({
    ...manifest,
    iconDef: iconMap[manifest.icon],
  }))
}

// Convert AppWithIcon to the old AppType format for backward compatibility
export function convertToAppType(app: AppWithIcon) {
  return {
    id: app.id,
    name: app.name,
    icon: app.iconDef,
    color: app.color,
    description: app.description,
    category: app.category,
  }
}
