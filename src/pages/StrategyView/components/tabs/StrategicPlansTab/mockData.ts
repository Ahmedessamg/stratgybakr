export interface StrategicPlan {
  id: string;
  goalName: string;
  owner: {
    name: string;
    avatar: string;
  };
  quarter: string;
  dateRange: string;
  progress: number;
}

export const mockStrategicPlans: StrategicPlan[] = [
  {
    id: '1',
    goalName: 'زيادة عدد المسافرين بنسبة 20٪ خلال الخمس سنوات القادمة',
    owner: {
      name: 'مراد عبداللطيف',
      avatar: '/assets/images/avatar-default.png'
    },
    quarter: 'الربع الاول',
    dateRange: '22 مارس 2024 - 22 اكتوبر 2024',
    progress: 0
  },
  {
    id: '2',
    goalName: 'تحسين جودة البنية التحتية بتقليل معدلات الازدحام بنسبة 30٪',
    owner: {
      name: 'مراد عبداللطيف',
      avatar: '/assets/images/avatar-default.png'
    },
    quarter: 'الربع الاول',
    dateRange: '22 مارس 2024 - 22 اكتوبر 2024',
    progress: 0
  },
  {
    id: '3',
    goalName: 'زيادة معدلات الرضا للمسافرين بنسبة 25٪',
    owner: {
      name: 'مراد عبداللطيف',
      avatar: '/assets/images/avatar-default.png'
    },
    quarter: 'الربع الاول',
    dateRange: '22 مارس 2024 - 22 اكتوبر 2024',
    progress: 0
  },
  {
    id: '4',
    goalName: 'تطوير شبكة نقاط التوزيع لتوفير خدمات نقل فعالة وموثوقة',
    owner: {
      name: 'مراد عبداللطيف',
      avatar: '/assets/images/avatar-default.png'
    },
    quarter: 'الربع الاول',
    dateRange: '22 مارس 2024 - 22 اكتوبر 2024',
    progress: 0
  }
];
