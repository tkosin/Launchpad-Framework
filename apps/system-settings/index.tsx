"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUsers,
  faGear,
  faDatabase,
  faShield,
  faPlus,
  faTrash,
  faEdit,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/contexts/toast-context"
import { AddUserModal } from "./components/add-user-modal"
import { ConfirmDialog } from "./components/confirm-dialog"
import { loadApps, convertToAppType } from "@/utils/app-loader"
import type { AppType } from "@/types/app"

// Mock user data for demonstration
const mockUsers = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@facgure.com",
    role: "admin" as const,
    status: "active" as const,
    avatar: "/avatars/avatar-1.png",
    company: "Facgure Technologies",
    createdAt: "2023-01-15",
    appAccess: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // App IDs
  },
  {
    id: "user-1",
    name: "อภิชาติ นิลมณีติ",
    email: "user@facgure.com",
    role: "user" as const,
    status: "active" as const,
    avatar: "/diverse-group.png",
    company: "บริษัท โซลาร์เอเชีย.เท็ค จำกัด",
    createdAt: "2023-03-22",
    appAccess: [1, 2, 3, 4], // App IDs
  },
  {
    id: "user-2",
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    role: "user" as const,
    status: "inactive" as const,
    avatar: "/avatars/avatar-2.png",
    company: "การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย",
    createdAt: "2023-05-10",
    appAccess: [1, 3], // App IDs
  },
]

export default function SystemSettingsApp() {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [availableApps, setAvailableApps] = useState<AppType[]>([])

  // Load all available apps
  useState(() => {
    const apps = loadApps().map((app) => convertToAppType(app))
    setAvailableApps(apps)
  })

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = (newUser: any) => {
    // Generate a unique ID for the new user
    const newUserId = `user-${Date.now()}`

    // Add the new user to the list
    setUsers([
      ...users,
      {
        ...newUser,
        id: newUserId,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active" as const,
      },
    ])

    // Show success toast
    showToast(
      "success",
      language === "en" ? "User Added" : "เพิ่มผู้ใช้แล้ว",
      language === "en" ? `${newUser.name} has been added successfully` : `เพิ่ม ${newUser.name} เรียบร้อยแล้ว`,
    )
  }

  const handleDeleteUser = (userId: string) => {
    setSelectedUserId(userId)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = () => {
    if (selectedUserId) {
      // Find user name before deletion for the toast message
      const userToDelete = users.find((user) => user.id === selectedUserId)

      // Remove the user from the list
      setUsers(users.filter((user) => user.id !== selectedUserId))

      // Show success toast
      if (userToDelete) {
        showToast(
          "success",
          language === "en" ? "User Deleted" : "ลบผู้ใช้แล้ว",
          language === "en"
            ? `${userToDelete.name} has been deleted successfully`
            : `ลบ ${userToDelete.name} เรียบร้อยแล้ว`,
        )
      }

      // Close the confirmation dialog
      setShowDeleteConfirm(false)
      setSelectedUserId(null)
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active"

          // Show status change toast
          showToast(
            "info",
            language === "en" ? "Status Updated" : "อัปเดตสถานะแล้ว",
            language === "en"
              ? `${user.name}'s status changed to ${newStatus}`
              : `สถานะของ ${user.name} เปลี่ยนเป็น ${newStatus === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}`,
          )

          return { ...user, status: newStatus as "active" | "inactive" }
        }
        return user
      }),
    )
  }

  // Get app name by ID
  const getAppName = (appId: number) => {
    const app = availableApps.find((app) => app.id === appId)
    return app ? app.name : `App ${appId}`
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* App Header */}
      <div className="bg-facgure-blue text-white p-4">
        <h1 className="text-xl font-medium">{language === "en" ? "System Settings" : "การตั้งค่าระบบ"}</h1>
        <p className="text-sm opacity-80">
          {language === "en" ? "Manage system configuration and users" : "จัดการการกำหนดค่าระบบและผู้ใช้"}
        </p>
      </div>

      {/* App Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "users"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("users")}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          {language === "en" ? "User Management" : "การจัดการผู้ใช้"}
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "settings"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <FontAwesomeIcon icon={faGear} className="mr-2" />
          {language === "en" ? "General Settings" : "การตั้งค่าทั่วไป"}
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "database"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("database")}
        >
          <FontAwesomeIcon icon={faDatabase} className="mr-2" />
          {language === "en" ? "Database" : "ฐานข้อมูล"}
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "security"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("security")}
        >
          <FontAwesomeIcon icon={faShield} className="mr-2" />
          {language === "en" ? "Security" : "ความปลอดภัย"}
        </button>
      </div>

      {/* App Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">{language === "en" ? "User Management" : "การจัดการผู้ใช้"}</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === "en" ? "Search users..." : "ค้นหาผู้ใช้..."}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                <button
                  className="px-4 py-2 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                  {language === "en" ? "Add User" : "เพิ่มผู้ใช้"}
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {language === "en" ? "User" : "ผู้ใช้"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {language === "en" ? "Role" : "บทบาท"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {language === "en" ? "Status" : "สถานะ"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {language === "en" ? "App Access" : "การเข้าถึงแอป"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {language === "en" ? "Created" : "สร้างเมื่อ"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {language === "en" ? "Actions" : "การดำเนินการ"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role === "admin"
                            ? language === "en"
                              ? "Administrator"
                              : "ผู้ดูแลระบบ"
                            : language === "en"
                              ? "User"
                              : "ผู้ใช้"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status === "active"
                            ? language === "en"
                              ? "Active"
                              : "ใช้งาน"
                            : language === "en"
                              ? "Inactive"
                              : "ไม่ใช้งาน"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.appAccess.length} {language === "en" ? "apps" : "แอป"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.appAccess
                            .slice(0, 3)
                            .map((appId) => getAppName(appId))
                            .join(", ")}
                          {user.appAccess.length > 3 &&
                            `, +${user.appAccess.length - 3} ${language === "en" ? "more" : "เพิ่มเติม"}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-facgure-blue hover:text-opacity-80"
                            title={language === "en" ? "Edit user" : "แก้ไขผู้ใช้"}
                          >
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          </button>
                          {/* Don't allow deleting your own account */}
                          {user.email !== "admin@facgure.com" && (
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteUser(user.id)}
                              title={language === "en" ? "Delete user" : "ลบผู้ใช้"}
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">{language === "en" ? "No users found" : "ไม่พบผู้ใช้"}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-lg font-medium mb-4">{language === "en" ? "General Settings" : "การตั้งค่าทั่วไป"}</h2>
            <p className="text-gray-500">
              {language === "en" ? "General system settings will appear here." : "การตั้งค่าระบบทั่วไปจะปรากฏที่นี่"}
            </p>
          </div>
        )}

        {activeTab === "database" && (
          <div>
            <h2 className="text-lg font-medium mb-4">{language === "en" ? "Database Settings" : "การตั้งค่าฐานข้อมูล"}</h2>
            <p className="text-gray-500">
              {language === "en"
                ? "Database configuration and management will appear here."
                : "การกำหนดค่าและการจัดการฐานข้อมูลจะปรากฏที่นี่"}
            </p>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-lg font-medium mb-4">
              {language === "en" ? "Security Settings" : "การตั้งค่าความปลอดภัย"}
            </h2>
            <p className="text-gray-500">
              {language === "en"
                ? "Security configuration and access controls will appear here."
                : "การกำหนดค่าความปลอดภัยและการควบคุมการเข้าถึงจะปรากฏที่นี่"}
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={handleAddUser}
        availableApps={availableApps}
        language={language}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteUser}
        title={language === "en" ? "Delete User" : "ลบผู้ใช้"}
        message={
          language === "en"
            ? "Are you sure you want to delete this user? This action cannot be undone."
            : "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถยกเลิกได้"
        }
        confirmText={language === "en" ? "Delete" : "ลบ"}
        cancelText={language === "en" ? "Cancel" : "ยกเลิก"}
        language={language}
      />
    </div>
  )
}
