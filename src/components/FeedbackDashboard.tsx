import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Sparkles,
  Users,
  AlertCircle,
  Receipt,
  MessageSquare,
  Star,
  Trash2,
  Check,
  RefreshCw,
  Download,
  Calendar,
  Hash,
} from 'lucide-react';
import { CustomerFeedback, FEEDBACK_CATEGORIES, FeedbackCategory, FeedbackStatus } from '../types';

interface FeedbackDashboardProps {
  feedbacks: CustomerFeedback[];
  onUpdateStatus: (id: string, status: FeedbackStatus, note?: string) => void;
  onDeleteFeedback: (id: string) => void;
  onResetData: () => void;
  onOpenScanForm: (tableNum: string) => void;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  feedbacks,
  onUpdateStatus,
  onDeleteFeedback,
  onResetData,
  onOpenScanForm,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTabTable, setActiveTabTable] = useState<string>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Calculate statistics
  const totalCount = feedbacks.length;
  const newCount = feedbacks.filter((f) => f.status === 'new').length;
  const inProgressCount = feedbacks.filter((f) => f.status === 'in_progress').length;
  const resolvedCount = feedbacks.filter((f) => f.status === 'resolved').length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalCount).toFixed(1)
      : '0.0';

  // Distinct table numbers for quick filter
  const tableNumbers = Array.from(new Set(feedbacks.map((f) => f.tableNumber))).sort();

  // Filtered list
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesSearch =
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.customerPhone && item.customerPhone.includes(searchTerm));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesTable = activeTabTable === 'all' || item.tableNumber === activeTabTable;

    return matchesSearch && matchesStatus && matchesCategory && matchesTable;
  });

  const getCategoryIcon = (key: FeedbackCategory) => {
    switch (key) {
      case 'service_speed':
        return <Clock className="w-4 h-4 text-[#8B0000]" />;
      case 'food_taste':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'hygiene':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'staff_attitude':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'order_accuracy':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'pricing_billing':
        return <Receipt className="w-4 h-4 text-emerald-600" />;
      case 'other':
      default:
        return <MessageSquare className="w-4 h-4 text-stone-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const timeStr = d.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return `${timeStr} • ${dateStr}`;
  };

  const handleExportCSV = () => {
    if (feedbacks.length === 0) return;
    const headers = 'លេខសម្គាល់,លេខតុ,កាលបរិច្ឆេទ,ប្រភេទ,ផ្កាយ,មតិយោបល់,កម្រិតបន្ទាន់,ស្ថានភាព,ឈ្មោះអតិថិជន,លេខទូរស័ព្ទ,កំណត់ចំណាំដោះស្រាយ\n';
    const rows = feedbacks
      .map(
        (f) =>
          `"${f.id}","តុ ${f.tableNumber}","${f.createdAt}","${f.category}","${f.rating}","${f.comment.replace(
            /"/g,
            '""'
          )}","${f.urgency}","${f.status}","${f.customerName || ''}","${f.customerPhone || ''}","${(
            f.resolutionNote || ''
          ).replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kimmo-customer-feedbacks-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEditNote = (item: CustomerFeedback) => {
    setEditingNoteId(item.id);
    setNoteInput(item.resolutionNote || '');
  };

  const handleSaveNote = (id: string) => {
    const current = feedbacks.find((f) => f.id === id);
    if (current) {
      onUpdateStatus(id, current.status, noteInput);
    }
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards (White cards with Dark Red accents) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total feedback */}
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 shadow-sm hover:border-[#8B0000]/40 transition-colors">
          <div className="text-xs font-medium text-stone-500 font-dangrek">មតិសរុបទាំងអស់</div>
          <div className="text-3xl font-dangrek text-[#8B0000] mt-1">{totalCount}</div>
          <div className="text-[11px] text-stone-400 mt-1">ពីគ្រប់តុទាំងអស់</div>
        </div>

        {/* New complaints */}
        <div className="bg-white border-2 border-red-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-medium text-red-700 font-dangrek flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>មិនទាន់ដោះស្រាយ (ថ្មី)</span>
          </div>
          <div className="text-3xl font-dangrek text-red-600 mt-1">{newCount}</div>
          <div className="text-[11px] text-red-500 mt-1">ត្រូវការពិនិត្យបន្ទាន់</div>
        </div>

        {/* In progress */}
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-medium text-amber-700 font-dangrek">កំពុងដោះស្រាយ</div>
          <div className="text-3xl font-dangrek text-amber-600 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">បុគ្គលិកកំពុងជួយតុ</div>
        </div>

        {/* Resolved */}
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-medium text-emerald-700 font-dangrek">ដោះស្រាយរួចរាល់</div>
          <div className="text-3xl font-dangrek text-emerald-600 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-stone-500 mt-1">ពិន្ទុមធ្យម ⭐ {avgRating}/5</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              id="input-search-feedback"
              type="text"
              placeholder="ស្វែងរកតាមលេខតុ ខ្លឹមសារមតិ ឬលេខទូរស័ព្ទ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-export-csv"
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-dangrek rounded-xl transition-colors"
              title="ទាញយកជាឯកសារ Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក CSV</span>
            </button>

            {feedbacks.length > 0 && (
              showResetConfirm ? (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl text-xs">
                  <span className="text-red-700 font-bold">សម្អាតមតិទាំងអស់?</span>
                  <button
                    id="btn-confirm-reset-data"
                    type="button"
                    onClick={() => {
                      onResetData();
                      setShowResetConfirm(false);
                    }}
                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded font-dangrek text-xs transition-colors"
                  >
                    យល់ព្រម
                  </button>
                  <button
                    id="btn-cancel-reset-data"
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-1.5 py-0.5 text-stone-500 hover:text-stone-800 text-xs"
                  >
                    បោះបង់
                  </button>
                </div>
              ) : (
                <button
                  id="btn-reset-sample-data"
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-stone-500 hover:text-red-600 hover:bg-red-50 text-xs font-dangrek rounded-xl transition-colors"
                  title="សម្អាតមតិយោបល់ទាំងអស់"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>សម្អាតទាំងអស់</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-400 font-dangrek flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ស្ថានភាព៖</span>
          </span>

          {[
            { key: 'all', label: 'ទាំងអស់' },
            { key: 'new', label: 'ថ្មី (មិនទាន់ដោះស្រាយ)' },
            { key: 'in_progress', label: 'កំពុងដោះស្រាយ' },
            { key: 'resolved', label: 'ដោះស្រាយរួច' },
          ].map((st) => (
            <button
              id={`btn-filter-status-${st.key}`}
              key={st.key}
              type="button"
              onClick={() => setStatusFilter(st.key)}
              className={`px-2.5 py-1 rounded-lg font-dangrek transition-all ${
                statusFilter === st.key
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {st.label}
            </button>
          ))}

          {/* Table filter if multiple tables exist */}
          {tableNumbers.length > 1 && (
            <>
              <span className="text-stone-300 mx-1">|</span>
              <select
                id="select-filter-table"
                value={activeTabTable}
                onChange={(e) => setActiveTabTable(e.target.value)}
                className="px-2 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:border-[#8B0000]"
              >
                <option value="all">គ្រប់តុទាំងអស់</option>
                {tableNumbers.map((tbl) => (
                  <option key={tbl} value={tbl}>
                    តុលេខ {tbl}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* List of Feedback / Complaints */}
      <div className="space-y-3">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center text-stone-500">
            <MessageSquare className="w-12 h-12 mx-auto text-stone-300 mb-2" />
            <h3 className="font-dangrek text-lg text-stone-700">មិនមានមតិយោបល់ ឬការត្អូញត្អែរទេ</h3>
            <p className="text-xs text-stone-400 mt-1">
              សូមសាកល្បងកែប្រែពាក្យស្វែងរក ឬស្កេនផ្ញើមតិថ្មីពីតុអាហារ
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((item) => {
            const catInfo = FEEDBACK_CATEGORIES.find((c) => c.key === item.category);
            const isEditingNote = editingNoteId === item.id;

            return (
              <div
                id={`card-feedback-${item.id}`}
                key={item.id}
                className={`bg-white border-2 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md ${
                  item.status === 'new'
                    ? 'border-red-300 ring-1 ring-red-200'
                    : item.status === 'in_progress'
                    ? 'border-amber-200'
                    : 'border-stone-200'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Big Table Number Badge */}
                    <div className="inline-flex items-center gap-1 bg-[#8B0000] text-white px-3 py-1 rounded-lg font-dangrek text-base shadow-xs">
                      <Hash className="w-4 h-4 text-amber-300" />
                      <span>តុលេខ {item.tableNumber}</span>
                    </div>

                    {/* Category */}
                    <div className="inline-flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-md text-xs font-semibold text-stone-800">
                      {getCategoryIcon(item.category)}
                      <span>{catInfo?.labelKhmer || item.category}</span>
                    </div>

                    {/* Rating stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= item.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-stone-200 fill-stone-100'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Urgency */}
                    {item.urgency === 'high' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        បន្ទាន់ខ្លាំង
                      </span>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Comment Body */}
                <div className="py-3">
                  <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                    "{item.comment}"
                  </p>
                </div>

                {/* Resolution note */}
                {item.resolutionNote && !isEditingNote && (
                  <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">ដំណោះស្រាយពីអ្នកគ្រប់គ្រង៖</span> {item.resolutionNote}
                    </div>
                  </div>
                )}

                {/* Note edit box */}
                {isEditingNote && (
                  <div className="mb-3 p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <label htmlFor={`input-note-${item.id}`} className="block text-xs font-bold text-stone-700">
                      កត់ត្រាវិធានការដោះស្រាយរបស់ហាង៖
                    </label>
                    <textarea
                      id={`input-note-${item.id}`}
                      rows={2}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="កត់ត្រាវិធានការដោះស្រាយ..."
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B0000]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        id={`btn-cancel-note-${item.id}`}
                        type="button"
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                      >
                        បោះបង់
                      </button>
                      <button
                        id={`btn-save-note-${item.id}`}
                        type="button"
                        onClick={() => handleSaveNote(item.id)}
                        className="px-3 py-1 text-xs bg-[#8B0000] text-white font-dangrek rounded"
                      >
                        រក្សាទុកកំណត់ចំណាំ
                      </button>
                    </div>
                  </div>
                )}

                {/* Card footer: Action bar */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Status Buttons */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400 font-dangrek mr-1">ប្តូរស្ថានភាព៖</span>

                    <button
                      id={`btn-status-new-${item.id}`}
                      type="button"
                      onClick={() => onUpdateStatus(item.id, 'new')}
                      className={`px-2.5 py-1 rounded-md font-dangrek transition-all ${
                        item.status === 'new'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      ថ្មី
                    </button>

                    <button
                      id={`btn-status-progress-${item.id}`}
                      type="button"
                      onClick={() => onUpdateStatus(item.id, 'in_progress')}
                      className={`px-2.5 py-1 rounded-md font-dangrek transition-all ${
                        item.status === 'in_progress'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      កំពុងពិនិត្យ
                    </button>

                    <button
                      id={`btn-status-resolved-${item.id}`}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(item.id, 'resolved');
                        if (!item.resolutionNote) {
                          handleStartEditNote(item);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md font-dangrek transition-all flex items-center gap-1 ${
                        item.status === 'resolved'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      ដោះស្រាយរួច
                    </button>
                  </div>

                  {/* Secondary actions */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-edit-note-trigger-${item.id}`}
                      type="button"
                      onClick={() => handleStartEditNote(item)}
                      className="text-stone-500 hover:text-[#8B0000] hover:underline"
                    >
                      {item.resolutionNote ? 'កែសម្រួលកំណត់ចំណាំ' : '+ កត់ត្រាដំណោះស្រាយ'}
                    </button>

                    <button
                      id={`btn-test-scan-table-${item.id}`}
                      type="button"
                      onClick={() => onOpenScanForm(item.tableNumber)}
                      className="text-stone-500 hover:text-[#8B0000] hover:underline"
                      title="បើកមើលទម្រង់តុនេះ"
                    >
                      ទម្រង់តុ {item.tableNumber}
                    </button>

                    {/* Delete button with inline confirmation */}
                    {deletingId === item.id ? (
                      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-1 rounded-lg text-xs animate-in fade-in">
                        <span className="text-red-700 font-semibold">លុបមតិនេះ?</span>
                        <button
                          id={`btn-confirm-delete-${item.id}`}
                          type="button"
                          onClick={() => {
                            onDeleteFeedback(item.id);
                            setDeletingId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-dangrek rounded text-xs transition-colors"
                        >
                          បាទ/ចាស
                        </button>
                        <button
                          id={`btn-cancel-delete-${item.id}`}
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="px-1.5 py-0.5 text-stone-500 hover:text-stone-800 text-xs"
                        >
                          បោះបង់
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-delete-feedback-${item.id}`}
                        type="button"
                        onClick={() => setDeletingId(item.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs"
                        title="លុបមតិយោបល់នេះ"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-stone-500 hover:text-red-600">លុប</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
