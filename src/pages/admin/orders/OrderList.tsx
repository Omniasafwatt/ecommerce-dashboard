import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_ORDER_LIST as MOCK_ORDERS, ORDER_LIST_STORES as STORES, ORDER_LIST_GOVERNORATES as GOVERNORATES } from '@/mock/mock.orders'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  store: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  itemsCount: number;
  total: number;
  date: string;
  governorate: string;
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refund_requested";

type PaymentMethod = "tap" | "cod";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ─── Mock Data ────────────────────────────────────────────────────────────────


// ─── Badge Helpers ────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:          { label: "Pending",          className: "bg-amber-100 text-amber-800 border border-amber-200" },
  confirmed:        { label: "Confirmed",         className: "bg-blue-100 text-blue-800 border border-blue-200" },
  preparing:        { label: "Preparing",         className: "bg-indigo-100 text-indigo-800 border border-indigo-200" },
  ready:            { label: "Ready",             className: "bg-cyan-100 text-cyan-800 border border-cyan-200" },
  out_for_delivery: { label: "Out for Delivery",  className: "bg-purple-100 text-purple-800 border border-purple-200" },
  delivered:        { label: "Delivered",         className: "bg-green-100 text-green-800 border border-green-200" },
  cancelled:        { label: "Cancelled",         className: "bg-red-100 text-red-800 border border-red-200" },
  refund_requested: { label: "Refund Requested",  className: "bg-orange-100 text-orange-800 border border-orange-200" },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  pending:  { label: "Pending",  className: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
  paid:     { label: "Paid",     className: "bg-green-100 text-green-800 border border-green-200" },
  failed:   { label: "Failed",   className: "bg-red-100 text-red-800 border border-red-200" },
  refunded: { label: "Refunded", className: "bg-slate-100 text-slate-700 border border-slate-200" },
};

const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string; className: string }> = {
  tap: { label: "Tap", className: "bg-violet-100 text-violet-800 border border-violet-200" },
  cod: { label: "COD", className: "bg-sky-100 text-sky-800 border border-sky-200" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const cfg = PAYMENT_METHOD_CONFIG[method];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_CONFIG[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderList() {
  const navigate = useNavigate();

  // Filters
  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [selectedGovernorate, setSelectedGovernorate] = useState("All Governorates");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Table state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  // Simulated websocket new-orders count
  const [newOrdersCount] = useState(3);
  const [wsConnected] = useState(true);

  const PAGE_SIZE = 8;

  // Close bulk menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node)) {
        setBulkMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Status multi-select toggle
  function toggleStatus(s: string) {
    setSelectedStatuses(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  // Filter logic
  const filtered = MOCK_ORDERS.filter(order => {
    if (orderSearch && !order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) return false;
    if (customerSearch && !order.customerName.toLowerCase().includes(customerSearch.toLowerCase()) && !order.customerPhone.includes(customerSearch)) return false;
    if (selectedStore !== "All Stores" && order.store !== selectedStore) return false;
    if (selectedGovernorate !== "All Governorates" && order.governorate !== selectedGovernorate) return false;
    if (selectedPaymentMethod !== "all" && order.paymentMethod !== selectedPaymentMethod) return false;
    if (selectedPaymentStatus !== "all" && order.paymentStatus !== selectedPaymentStatus) return false;
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) return false;
    if (dateFrom && order.date < dateFrom) return false;
    if (dateTo && order.date > dateTo + "T23:59:59Z") return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function clearFilters() {
    setOrderSearch("");
    setCustomerSearch("");
    setSelectedStore("All Stores");
    setSelectedGovernorate("All Governorates");
    setSelectedPaymentMethod("all");
    setSelectedPaymentStatus("all");
    setSelectedStatuses([]);
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  }

  function toggleSelectAll() {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map(o => o.id)));
    }
  }

  function toggleRow(id: string) {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleBulkCancel() {
    setShowBulkConfirm(false);
    setSelectedRows(new Set());
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-KW", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const allStatuses = Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            {wsConnected && newOrdersCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                {newOrdersCount} new orders
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            {selectedRows.size > 0 && (
              <div className="relative" ref={bulkMenuRef}>
                <button
                  onClick={() => setBulkMenuOpen(v => !v)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  Bulk Actions ({selectedRows.size})
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {bulkMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => { setBulkMenuOpen(false); setShowBulkConfirm(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Cancel Selected
                    </button>
                  </div>
                )}
              </div>
            )}
            <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Order Number Search */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-500">Order #</label>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Search order #"
                  value={orderSearch}
                  onChange={e => { setOrderSearch(e.target.value); setCurrentPage(1); }}
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Customer Search */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-500">Customer</label>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input
                  type="text"
                  placeholder="Name or phone"
                  value={customerSearch}
                  onChange={e => { setCustomerSearch(e.target.value); setCurrentPage(1); }}
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Store */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-500">Store</label>
              <select
                value={selectedStore}
                onChange={e => { setSelectedStore(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STORES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Governorate */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-500">Governorate</label>
              <select
                value={selectedGovernorate}
                onChange={e => { setSelectedGovernorate(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GOVERNORATES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-500">Payment Method</label>
              <select
                value={selectedPaymentMethod}
                onChange={e => { setSelectedPaymentMethod(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="tap">Tap</option>
                <option value="cod">COD</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-500">Payment Status</label>
              <select
                value={selectedPaymentStatus}
                onChange={e => { setSelectedPaymentStatus(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Order Status Multi-Select */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Order Status</label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg bg-white min-w-[200px] max-w-[320px]">
                {allStatuses.map(s => {
                  const cfg = ORDER_STATUS_CONFIG[s];
                  const active = selectedStatuses.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => { toggleStatus(s); setCurrentPage(1); }}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${active ? cfg.className + " opacity-100" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date From */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-500">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-500">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-transparent select-none">Clear</label>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {paginated.length} of {filtered.length} orders</span>
          {selectedRows.size > 0 && (
            <span className="font-medium text-blue-600">{selectedRows.size} selected</span>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginated.length && paginated.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pay Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total (KWD)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="text-sm font-medium">No orders found</p>
                      <p className="text-xs mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map(order => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(order.id)}
                          onChange={() => toggleRow(order.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          onClick={e => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline cursor-pointer"
                        >
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.store}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3"><PaymentMethodBadge method={order.paymentMethod} /></td>
                      <td className="px-4 py-3"><PaymentStatusBadge status={order.paymentStatus} /></td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{order.itemsCount}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{order.total.toFixed(3)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(order.date)}</td>
                      <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === currentPage ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Cancel Confirmation Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cancel Orders</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to cancel <span className="font-semibold text-red-600">{selectedRows.size} selected orders</span>? Customers will be notified and eligible orders will be refunded.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Go Back
              </button>
              <button
                onClick={handleBulkCancel}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700"
              >
                Cancel Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
