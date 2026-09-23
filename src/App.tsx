import { useState, useEffect } from 'react';
import {
  QrCode,
  MessageSquareWarning,
  Store,
  Lock,
  LogOut,
  ShieldCheck,
  X,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { KimmoLogo } from './components/KimmoLogo';
import { CustomerFeedbackForm } from './components/CustomerFeedbackForm';
import { QrCodeGenerator } from './components/QrCodeGenerator';
import { FeedbackDashboard } from './components/FeedbackDashboard';
import { CustomerFeedback, FeedbackStatus } from './types';
import {
  subscribeToFeedbacks,
  addFeedback,
  updateFeedback,
  deleteFeedback,
  clearAllFeedbacks,
} from './services/feedbackService';

type AppMode = 'customer' | 'admin';
type AdminTab = 'feedback-inbox' | 'qr-generator' | 'customer-preview';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('customer');
  const [adminTab, setAdminTab] = useState<AdminTab>('feedback-inbox');
  const [activeTableNumber, setActiveTableNumber] = useState<string>('05');
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [newAlertMessage, setNewAlertMessage] = useState<string | null>(null);

  // Staff Login Modal State
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Real-time synchronization across all devices via Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToFeedbacks((items) => {
      setFeedbacks(items);
    });

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tableFromQuery = urlParams.get('table');
      const modeFromQuery = urlParams.get('mode');

      if (tableFromQuery) {
        setActiveTableNumber(tableFromQuery);
        setAppMode('customer'); // Customers who scan are always strictly in customer mode
      } else if (modeFromQuery === 'admin') {
        setAppMode('admin');
      }
    }

    return () => unsubscribe();
  }, []);

  // Handle new feedback submission from customer
  const handleFeedbackSubmit = async (newFeedback: CustomerFeedback) => {
    await addFeedback(newFeedback);

    // Only notify if in admin mode
    if (appMode === 'admin') {
      setNewAlertMessage(`បានទទួលមតិថ្មីពី តុលេខ ${newFeedback.tableNumber}!`);
      setTimeout(() => setNewAlertMessage(null), 5000);
    }
  };

  // Handle updating feedback status & resolution note
  const handleUpdateStatus = async (id: string, status: FeedbackStatus, note?: string) => {
    await updateFeedback(id, status, note);
  };

  // Handle deleting feedback
  const handleDeleteFeedback = async (id: string) => {
    await deleteFeedback(id);
  };

  // Handle clearing all feedback entries
  const handleResetData = async () => {
    await clearAllFeedbacks();
  };

  // Navigate to customer form simulating a scan for a specific table
  const handleSimulateScan = (tableNum: string) => {
    setActiveTableNumber(tableNum);
    setAppMode('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Staff PIN authentication
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setAppMode('admin');
      setShowStaffModal(false);
      setPinInput('');
      setPinError(null);
    } else {
      setPinError('លេខកូដសម្ងាត់មិនត្រឹមត្រូវ!');
    }
  };

  const pendingComplaintsCount = feedbacks.filter((f) => f.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#faf7f7] text-[#1c1917] flex flex-col selection:bg-[#8B0000] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. CUSTOMER MODE VIEW: Customer can ONLY see feedback form and submit */}
      {/* ========================================================================= */}
      {appMode === 'customer' ? (
        <>
          {/* Customer Clean Brand Header (Soft, pleasing, easy on the eyes) */}
          <header className="no-print sticky top-0 z-40 bg-white/95 border-b border-stone-200/80 shadow-xs backdrop-blur-md">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between h-16 sm:h-20">
                {/* Brand Logo */}
                <div className="transition-opacity hover:opacity-90">
                  <KimmoLogo size="md" variant="dark" />
                </div>

                {/* Table Badge indicator & Staff Access (Softer, pleasant colors) */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200/80 rounded-full font-dangrek text-xs text-stone-700 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-stone-600">តុលេខ</span>
                    <span className="text-sm font-bold text-[#8B0000] bg-white px-2 py-0.5 rounded-md border border-red-200/70 shadow-2xs font-mono">
                      {activeTableNumber}
                    </span>
                  </div>

                  <button
                    id="btn-header-staff-portal"
                    type="button"
                    onClick={() => setShowStaffModal(true)}
                    title="ច្រកចូលបុគ្គលិក / Staff Portal"
                    className="p-2 text-stone-400 hover:text-[#8B0000] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Customer Main Area: Pure Form (Comment & Submit only) */}
          <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <CustomerFeedbackForm
              initialTable={activeTableNumber}
              onSubmitSuccess={handleFeedbackSubmit}
            />
          </main>

          {/* Customer Minimal Footer with discrete Staff Portal link */}
          <footer className="no-print mt-auto bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
            <div className="max-w-2xl mx-auto px-4 flex flex-col items-center gap-3">
              <p className="text-stone-500 font-medium">
                គីមម៉ូ មីហឹរ 7 កម្រិត • រីករាយទទួលយកមតិកែលម្អដើម្បីស្ថាបនា
              </p>
              <p className="text-stone-400 text-[11px]">
                រក្សាសិទ្ធិគ្រប់យ៉ាង © {new Date().getFullYear()} KIMMO SPICY NOODLE
              </p>

              {/* Discreet Staff Portal Entrance */}
              <div className="pt-2 border-t border-stone-100 w-full flex justify-center">
                <button
                  id="btn-open-staff-portal"
                  type="button"
                  onClick={() => setShowStaffModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-400 hover:text-[#8B0000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ច្រកចូលបុគ្គលិក / អ្នកគ្រប់គ្រង (Staff Portal)</span>
                </button>
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* ========================================================================= */
        /* 2. STAFF / ADMIN MODE VIEW: Full Management Portal                        */
        /* ========================================================================= */
        <>
          {/* Admin Header with full Management Tabs (Clean, light, easy to look) */}
          <header className="no-print sticky top-0 z-40 bg-white/95 border-b border-stone-200/80 shadow-xs backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between h-16 sm:h-20">
                {/* Brand & Admin Badge */}
                <div className="flex items-center gap-3">
                  <KimmoLogo size="md" variant="dark" />
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#8B0000] text-xs font-dangrek">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>ផ្នែកគ្រប់គ្រង</span>
                  </span>
                </div>

                {/* Management Navigation Tabs */}
                <nav className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    id="tab-admin-inbox"
                    type="button"
                    onClick={() => setAdminTab('feedback-inbox')}
                    className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-dangrek transition-all ${
                      adminTab === 'feedback-inbox'
                        ? 'bg-[#8B0000] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <MessageSquareWarning className="w-4 h-4" />
                    <span className="hidden sm:inline">ប្រអប់មតិ</span>
                    <span className="sm:hidden">មតិ</span>

                    {pendingComplaintsCount > 0 && (
                      <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black rounded-full bg-red-600 text-white shadow-xs">
                        {pendingComplaintsCount}
                      </span>
                    )}
                  </button>

                  <button
                    id="tab-admin-qr"
                    type="button"
                    onClick={() => setAdminTab('qr-generator')}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-dangrek transition-all ${
                      adminTab === 'qr-generator'
                        ? 'bg-[#8B0000] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="hidden sm:inline">QR Code តុ</span>
                    <span className="sm:hidden">QR</span>
                  </button>

                  {/* Switch directly to Customer Mode */}
                  <button
                    id="btn-exit-to-customer-view"
                    type="button"
                    onClick={() => setAppMode('customer')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs sm:text-sm font-dangrek transition-all cursor-pointer"
                    title="ត្រឡប់ទៅមើលទម្រង់អតិថិជន"
                  >
                    <Eye className="w-4 h-4 text-stone-600" />
                    <span className="hidden md:inline">ទម្រង់អតិថិជន</span>
                    <LogOut className="w-3.5 h-3.5 ml-1 text-stone-400" />
                  </button>
                </nav>
              </div>
            </div>
          </header>

          {/* Floating Notification Toast if new complaint arrives */}
          {newAlertMessage && (
            <div className="no-print fixed bottom-5 right-5 z-50 bg-[#8B0000] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-white flex items-center gap-3 animate-bounce">
              <MessageSquareWarning className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-dangrek">{newAlertMessage}</span>
              <button
                type="button"
                onClick={() => setAdminTab('feedback-inbox')}
                className="text-[11px] underline bg-white/20 px-2 py-0.5 rounded text-white"
              >
                មើលភ្លាមៗ
              </button>
            </div>
          )}

          {/* Admin Main Content Area */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {adminTab === 'feedback-inbox' && (
              <FeedbackDashboard
                feedbacks={feedbacks}
                onUpdateStatus={handleUpdateStatus}
                onDeleteFeedback={handleDeleteFeedback}
                onResetData={handleResetData}
                onOpenScanForm={handleSimulateScan}
              />
            )}

            {adminTab === 'qr-generator' && (
              <QrCodeGenerator onSimulateScan={handleSimulateScan} />
            )}
          </main>

          {/* Admin Footer */}
          <footer className="no-print mt-auto bg-stone-900 border-t border-stone-800 py-6 text-center text-xs text-stone-400">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-dangrek text-white font-bold text-sm">ផ្ទាំងគ្រប់គ្រងផ្ទៃក្នុង KIMMO</span>
                <span>• បុគ្គលិក & អ្នកគ្រប់គ្រង</span>
              </div>
              <button
                type="button"
                onClick={() => setAppMode('customer')}
                className="text-stone-300 hover:text-white underline font-dangrek text-xs"
              >
                ចាកចេញទៅកាន់ទម្រង់អតិថិជន →
              </button>
            </div>
          </footer>
        </>
      )}

      {/* ========================================================================= */}
      {/* STAFF PORTAL LOGIN MODAL                                                 */}
      {/* ========================================================================= */}
      {showStaffModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#8B0000]/20 rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setShowStaffModal(false);
                setPinError(null);
                setPinInput('');
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#8B0000] mb-3">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-dangrek text-center text-[#8B0000] mb-1">
              ច្រកចូលបុគ្គលិកហាង
            </h3>
            <p className="text-xs text-center text-stone-500 mb-5">
              សម្រាប់តែអ្នកគ្រប់គ្រង និងបុគ្គលិកពិនិត្យប្រអប់មតិយោបល់
            </p>

            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="input-staff-pin"
                  className="block text-xs font-bold text-stone-700 mb-1"
                >
                  លេខកូដសម្ងាត់បុគ្គលិក (PIN)
                </label>
                <input
                  id="input-staff-pin"
                  type="password"
                  autoFocus
                  placeholder="••••••••"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest border-2 border-stone-300 rounded-xl focus:outline-none focus:border-[#8B0000]"
                />
                {pinError && (
                  <p className="text-xs text-red-600 mt-2 text-center font-medium">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-staff-login"
                  type="submit"
                  className="w-full py-3 bg-[#8B0000] hover:bg-[#730000] text-white font-dangrek rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ផ្ទៀងផ្ទាត់ និងចូល</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

