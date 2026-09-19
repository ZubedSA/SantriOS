const lucide = require('lucide-react');

const icons = [
  'LayoutDashboard', 'Users', 'CalendarCheck', 'CreditCard', 'BookOpen', 'ArrowUpRight',
  'Clock', 'Sparkles', 'ShieldCheck', 'CheckCircle2', 'FileCheck', 'Building',
  'Receipt', 'ArrowDownCircle', 'ArrowUpCircle', 'FileText', 'AlertTriangle', 'Send',
  'PlusCircle', 'Wallet', 'Calendar', 'CheckSquare', 'Award', 'Home', 'ShieldAlert',
  'BedDouble', 'Check', 'X', 'Globe', 'Server', 'Activity', 'Layers', 'Phone', 'Bell',
  'Settings', 'UserPlus', 'GraduationCap'
];

let missing = [];
for (const icon of icons) {
  if (!lucide[icon]) {
    missing.push(icon);
  }
}

if (missing.length > 0) {
  console.log('MISSING ICONS:', missing);
} else {
  console.log('ALL ICONS EXIST IN LUCIDE-REACT!');
}
