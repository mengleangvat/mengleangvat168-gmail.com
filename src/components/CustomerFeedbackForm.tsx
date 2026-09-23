import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  RotateCcw,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomerFeedback } from '../types';

interface CustomerFeedbackFormProps {
  initialTable?: string;
  onSubmitSuccess: (feedback: CustomerFeedback) => void;
  onViewOtherTable?: () => void;
}

export const CustomerFeedbackForm: React.FC<CustomerFeedbackFormProps> = ({
  initialTable = '05',
  onSubmitSuccess,
}) => {
  const [tableNumber, setTableNumber] = useState<string>(initialTable);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittedFeedback, setSubmittedFeedback] = useState<CustomerFeedback | null>(null);

  // Update table number if props change (e.g., from URL query parameter)
  useEffect(() => {
    if (initialTable) {
      setTableNumber(initialTable);
    }
  }, [initialTable]);

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return 'មិនពេញចិត្តខ្លាំង (Very Dissatisfied)';
      case 2:
        return 'មិនសូវពេញចិត្ត (Needs Improvement)';
      case 3:
        return 'មធ្យម ទទួលយកបាន (Average)';
      case 4:
        return 'ពេញចិត្តល្អ (Good Experience)';
      case 5:
        return 'ល្អឥតខ្ចោះ ពេញចិត្តខ្លាំង (Excellent)';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('សូមសរសេរបរិយាយមតិ ឬបញ្ហារបស់លោកអ្នក!');
      return;
    }

    const newFeedback: CustomerFeedback = {
      id: 'fb-' + Date.now(),
      tableNumber: tableNumber.trim() || '01',
      category: 'other',
      rating,
      comment: comment.trim(),
      urgency: 'medium',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setSubmittedFeedback(newFeedback);
    onSubmitSuccess(newFeedback);

    // Trigger celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#8B0000', '#dc2626', '#fbbf24', '#ffffff'],
    });
  };

  const handleResetForm = () => {
    setComment('');
    setRating(5);
    setSubmittedFeedback(null);
  };

  if (submittedFeedback) {
    return (
      <div className="max-w-xl mx-auto bg-white border-2 border-[#8B0000]/20 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#8B0000]/10 flex items-center justify-center text-[#8B0000] mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-dangrek text-[#8B0000] mb-2">
          សូមអរគុណចំពោះមតិកែលម្អ!
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
          សាររបស់លោកអ្នកពី <strong className="text-[#8B0000] font-dangrek text-lg">តុលេខ {submittedFeedback.tableNumber}</strong> ត្រូវបានបញ្ជូនផ្ទាល់ទៅកាន់ប្រព័ន្ធគ្រប់គ្រងហាង KIMMO រួចរាល់ហើយ។ ក្រុមការងារយើងខ្ញុំនឹងចាត់វិធានការដោះស្រាយជូនភ្លាមៗ!
        </p>

        <div className="bg-[#faf7f7] border border-stone-200 rounded-xl p-4 text-left mb-6 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200 mb-2 font-medium">
            <span className="text-stone-500">លេខសម្គាល់៖</span>
            <span className="font-mono text-stone-700">#{submittedFeedback.id}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-200 mb-2">
            <span className="text-stone-500">កាលបរិច្ឆេទ & ម៉ោង៖</span>
            <span className="text-stone-800 font-medium">
              {new Date(submittedFeedback.createdAt).toLocaleTimeString('km-KH', {
                hour: '2-digit',
                minute: '2-digit',
              })} - {new Date(submittedFeedback.createdAt).toLocaleDateString('km-KH')}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-200 mb-2">
            <span className="text-stone-500">កម្រិតការពេញចិត្ត៖</span>
            <span className="text-[#8B0000] font-semibold">
              {'⭐'.repeat(submittedFeedback.rating)} ({submittedFeedback.rating}/5)
            </span>
          </div>
          <div className="pt-1">
            <span className="text-stone-500 block text-xs mb-1">ខ្លឹមសារមតិយោបល់៖</span>
            <p className="text-stone-800 italic bg-white p-2.5 rounded border border-stone-200">
              "{submittedFeedback.comment}"
            </p>
          </div>
        </div>

        <button
          id="btn-submit-another"
          type="button"
          onClick={handleResetForm}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#730000] text-white font-dangrek rounded-xl transition-colors shadow-md text-base cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          ផ្ញើមតិយោបល់បន្ថែម
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Form Container (White card with Dark Red accents) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-stone-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6"
      >
        {/* Table Number selector / editor */}
        <div className="bg-[#fef2f2] border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label htmlFor="input-table-number" className="block text-xs font-bold text-[#8B0000] uppercase tracking-wider mb-1">
              លេខតុអាហារ (Table Number)
            </label>
            <p className="text-stone-500 text-xs">
              កំណត់តាមរយៈការស្កេន QR Code លើតុអាហារ
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[#8B0000] font-dangrek text-lg">តុលេខ</span>
            <input
              id="input-table-number"
              type="text"
              value={tableNumber}
              readOnly
              tabIndex={-1}
              className="w-24 px-3 py-2 text-center text-xl font-dangrek text-[#8B0000] bg-red-50/60 border-2 border-[#8B0000]/40 rounded-lg cursor-default select-none focus:outline-none"
            />
          </div>
        </div>

        {/* Experience Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-dangrek text-stone-800">
              ១. កម្រិតការពេញចិត្តទូទៅ (Rating)
            </label>
            <span className="text-xs font-semibold text-[#8B0000]">
              {getRatingLabel(rating)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#faf7f7] border border-stone-200 py-3 rounded-xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                id={`btn-star-${star}`}
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 focus:outline-none group transition-transform hover:scale-125"
                title={`${star} ផ្កាយ`}
              >
                <Star
                  className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-stone-300 fill-stone-100 group-hover:text-stone-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment / Complaint text */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="input-comment" className="block text-sm font-dangrek text-stone-800">
              ២. បរិយាយមតិយោបល់ ឬការត្អូញត្អែររបស់លោកអ្នក <span className="text-[#8B0000]">*</span>
            </label>
            {comment.length > 0 && (
              <button
                id="btn-clear-comment"
                type="button"
                onClick={() => setComment('')}
                className="text-xs text-stone-400 hover:text-red-600 transition-colors font-medium"
              >
                សម្អាតអត្ថបទ (Clear)
              </button>
            )}
          </div>
          <textarea
            id="input-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 text-sm border-2 border-stone-300 rounded-xl focus:outline-none focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/20 resize-none text-stone-800"
          ></textarea>
        </div>

        {/* Submit Button placed right after comment */}
        <div className="pt-2 border-t border-stone-100">
          <button
            id="btn-submit-feedback"
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#8B0000] hover:bg-[#730000] active:scale-[0.99] text-white font-dangrek rounded-xl transition-all shadow-md hover:shadow-lg text-base sm:text-lg cursor-pointer group"
          >
            <Send className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            <span>ផ្ញើមតិយោបល់ / Submit Feedback</span>
          </button>
          <p className="text-center text-xs text-stone-400 mt-2">
            មតិយោបល់របស់លោកអ្នកនឹងត្រូវបញ្ជូនដោយផ្ទាល់ទៅកាន់អ្នកគ្រប់គ្រងហាង
          </p>
        </div>
      </form>
    </div>
  );
};
