export type FeedbackCategory =
  | 'service_speed'
  | 'food_taste'
  | 'hygiene'
  | 'staff_attitude'
  | 'order_accuracy'
  | 'pricing_billing'
  | 'other';

export type FeedbackUrgency = 'low' | 'medium' | 'high';
export type FeedbackStatus = 'new' | 'in_progress' | 'resolved';

export interface CustomerFeedback {
  id: string;
  tableNumber: string; // e.g. "01", "08", "VIP 1"
  category: FeedbackCategory;
  rating: number; // 1 to 5
  comment: string;
  customerName?: string;
  customerPhone?: string;
  urgency: FeedbackUrgency;
  status: FeedbackStatus;
  createdAt: string; // ISO date string
  resolutionNote?: string;
  resolvedAt?: string;
}

export interface CategoryInfo {
  key: FeedbackCategory;
  labelKhmer: string;
  iconName: string;
  description: string;
}

export const FEEDBACK_CATEGORIES: CategoryInfo[] = [
  {
    key: 'service_speed',
    labelKhmer: 'សេវាកម្មយឺតយ៉ាវ',
    iconName: 'Clock',
    description: 'រង់ចាំម្ហូបយូរ ឬបុគ្គលិកមិនសូវយកចិត្តទុកដាក់',
  },
  {
    key: 'food_taste',
    labelKhmer: 'រសជាតិអាហារ & មីហឹរ',
    iconName: 'Flame',
    description: 'កម្រិតហឹរមិនត្រឹមត្រូវ ត្រជាក់ ឬរសជាតិមិនពេញចិត្ត',
  },
  {
    key: 'hygiene',
    labelKhmer: 'អនាម័យ & បរិស្ថាន',
    iconName: 'Sparkles',
    description: 'តុមិនទាន់ជូត ចានស្លាបព្រា ឬបរិយាកាសក្នុងហាង',
  },
  {
    key: 'staff_attitude',
    labelKhmer: 'អាកប្បកិរិយាបុគ្គលិក',
    iconName: 'Users',
    description: 'ការនិយាយស្តី ការទទួលស្វាគមន៍ ឬភាពរួសរាយ',
  },
  {
    key: 'order_accuracy',
    labelKhmer: 'ខុសមុខម្ហូប / ខ្វះម្ហូប',
    iconName: 'AlertCircle',
    description: 'លើកម្ហូបច្រឡំតុ ឬខ្វះគ្រឿងបន្ថែមដែលបានកុម្ម៉ង់',
  },
  {
    key: 'pricing_billing',
    labelKhmer: 'វិក្កយបត្រ & ការគិតលុយ',
    iconName: 'Receipt',
    description: 'គិតលុយយូរ គិតខុស ឬបញ្ហាទូទាត់ប្រាក់',
  },
  {
    key: 'other',
    labelKhmer: 'មតិយោបល់ផ្សេងៗ',
    iconName: 'MessageSquare',
    description: 'ការកែលម្អទូទៅ ឬការសរសើរចំពោះភោជនីយដ្ឋាន',
  },
];
