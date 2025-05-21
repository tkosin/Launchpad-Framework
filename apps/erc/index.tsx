"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine, faFileAlt, faUsers, faBuilding } from "@fortawesome/free-solid-svg-icons"

export default function ERCApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* App Header */}
      <div className="bg-facgure-blue text-white p-4">
        <h1 className="text-xl font-medium">Energy Regulatory Commission</h1>
        <p className="text-sm opacity-80">Dashboard and regulatory tools</p>
      </div>

      {/* App Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "dashboard"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Dashboard
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "regulations"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("regulations")}
        >
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          Regulations
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "stakeholders"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("stakeholders")}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Stakeholders
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "organizations"
              ? "text-facgure-blue border-b-2 border-facgure-blue"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("organizations")}
        >
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Organizations
        </button>
      </div>

      {/* App Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-lg font-medium mb-4">ERC Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Regulatory Updates</h3>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <span className="text-facgure-blue">2023-12-10:</span> Updated guidelines for renewable energy
                    procurement
                  </li>
                  <li className="text-sm">
                    <span className="text-facgure-blue">2023-11-28:</span> New carbon emission reporting requirements
                  </li>
                  <li className="text-sm">
                    <span className="text-facgure-blue">2023-11-15:</span> Revised tariff structure for solar energy
                    producers
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming Deadlines</h3>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <span className="text-red-600">2023-12-31:</span> Annual compliance reports due
                  </li>
                  <li className="text-sm">
                    <span className="text-orange-500">2024-01-15:</span> Q1 energy production forecasts
                  </li>
                  <li className="text-sm">
                    <span className="text-green-600">2024-02-01:</span> Renewable energy credit applications open
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "regulations" && (
          <div>
            <h2 className="text-lg font-medium mb-4">Regulations</h2>
            <p className="text-gray-500">Regulatory information and compliance guidelines will appear here.</p>
          </div>
        )}

        {activeTab === "stakeholders" && (
          <div>
            <h2 className="text-lg font-medium mb-4">Stakeholders</h2>
            <p className="text-gray-500">Stakeholder management and communication tools will appear here.</p>
          </div>
        )}

        {activeTab === "organizations" && (
          <div>
            <h2 className="text-lg font-medium mb-4">Organizations</h2>
            <p className="text-gray-500">Organization directory and relationship management will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
