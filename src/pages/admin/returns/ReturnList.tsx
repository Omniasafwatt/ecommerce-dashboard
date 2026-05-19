import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ReturnRequest {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  reason: string;
  type: "Return" | "Replacement";
  status: "pending" | "approved" | "rejected";
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockData: ReturnRequest[] = [
  {
    id: "REQ-1001",
    orderNumber: "ORD-8821",
    customer: "Fatima Al-Rashidi",
    product: "Samsung Galaxy S24 Ultra",
    reason: "Received damaged item",
    type: "Return",
    status: "pending",
    date: "2026-05-09",
  },
  {
    id: "REQ-1002",
    orderNumber: "ORD-8756",
    customer: "Mohammed Al-Otaibi",
    product: "Apple AirPods Pro",
    reason: "Wrong item delivered",
    type: "Replacement",
    status: "approved",
    date: "2026-05-08",
  },
  {
    id: "REQ-1003",
    orderNumber: "ORD-8644",
    customer: "Noura Al-Shehri",
    product: "Sony WH-1000XM5 Headphones",
    reason: "Product not as described",
    type: "Return",
    status: "rejected",
    date: "2026-05-07",
  },
  {
    id: "REQ-1004",
    orderNumber: "ORD-8590",
    customer: "Abdullah Al-Harbi",
    product: "iPad Pro 12.9-inch",
    reason: "Changed mind",
    type: "Return",
    status: "pending",
    date: "2026-05-07",
  },
  {
    id: "REQ-1005",
    orderNumber: "ORD-8521",
    customer: "Sara Al-Mutairi",
    product: "DJI Mini 4 Pro Drone",
    reason: "Defective product",
    type: "Replacement",
    status: "approved",
    date: "2026-05-06",
  },
  {
    id: "REQ-1006",
    orderNumber: "ORD-8490",
    customer: "Khalid Al-Qahtani",
    product: "Dyson V15 Vacuum",
    reason: "Missing accessories",
    type: "Replacement",
    status: "pending",
    date: "2026-05-05",
  },
  {
    id: "REQ-1007",
    orderNumber: "ORD-8412",
    customer: "Lama Al-Dosari",
    product: "Nespresso Vertuo Next",
    reason: "Arrived broken",
    type: "Return",
    status: "rejected",
    date: "2026-05-04",
  },
  {
    id: "REQ-1008",
    orderNumber: "ORD-8388",
    customer: "Omar Al-Zahrani",
    product: "Bose SoundLink Max",
    reason: "Sound quality issue",
    type: "Replacement",
    status: "approved",
    date: "2026-05-03",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: ReturnRequest["status"] }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    approved: "bg-green-100 text-green-800 border border-green-200",
    rejected: "bg-red-100 text-red-800 border border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "pending"
            ? "bg-yellow-500"
            : status === "approved"
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TypeBadge = ({ type }: { type: ReturnRequest["type"] }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
      type === "Return"
        ? "bg-orange-50 text-orange-700 border border-orange-200"
        : "bg-blue-50 text-blue-700 border border-blue-200"
    }`}
  >
    {type}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReturnList() {
  const [activeTab, setActiveTab] = useState<"Returns" | "Replacements">(
    "Returns"
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filtered = mockData.filter((r) => {
    const matchTab =
      activeTab === "Returns" ? r.type === "Return" : r.type === "Replacement";
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchFrom = !dateFrom || r.date >= dateFrom;
    const matchTo = !dateTo || r.date <= dateTo;
    return matchTab && matchStatus && matchFrom && matchTo;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const summaryCount = (status: ReturnRequest["status"]) =>
    mockData.filter((r) => r.status === status).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Returns &amp; Replacements
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customer return and replacement requests
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(
          [
            { label: "Pending", status: "pending", color: "yellow" },
            { label: "Approved", status: "approved", color: "green" },
            { label: "Rejected", status: "rejected", color: "red" },
          ] as const
        ).map(({ label, status, color }) => (
          <div
            key={status}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                color === "yellow"
                  ? "bg-yellow-100"
                  : color === "green"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  color === "yellow"
                    ? "text-yellow-600"
                    : color === "green"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {summaryCount(status)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xs text-gray-400">Requests</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-0">
            {(["Returns", "Replacements"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {mockData.filter((r) => r.type === tab.slice(0, -1) || (tab === "Replacements" && r.type === "Replacement") || (tab === "Returns" && r.type === "Return")).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          {(statusFilter !== "all" || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
          <div className="ml-auto text-sm text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  "Request #",
                  "Order #",
                  "Customer",
                  "Product",
                  "Reason",
                  "Type",
                  "Status",
                  "Date",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-10 h-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span className="text-sm">No requests found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((req) => (
                  <tr
                    key={req.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedId === req.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-sky-600">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 font-medium">
                        {req.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {req.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm text-gray-800 whitespace-nowrap">
                          {req.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm text-gray-700 max-w-[160px] truncate block"
                        title={req.product}
                      >
                        {req.product}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm text-gray-500 max-w-[140px] truncate block"
                        title={req.reason}
                      >
                        {req.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={req.type} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {req.date}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setSelectedId(
                            selectedId === req.id ? null : req.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * rowsPerPage + 1}–
              {Math.min(currentPage * rowsPerPage, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    currentPage === p
                      ? "bg-sky-500 text-white"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
