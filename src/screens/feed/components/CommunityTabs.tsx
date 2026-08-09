import { Tab } from '@/shared/components/ui';

export type CommunityTabValue = 'story' | 'feed';

interface CommunityTabsProps {
  value: CommunityTabValue;
  onChange: (value: CommunityTabValue) => void;
}

export default function CommunityTabs({ value, onChange }: CommunityTabsProps) {
  return (
    <Tab value={value} onChange={next => onChange(next as CommunityTabValue)}>
      <Tab.Item value="story">스토리</Tab.Item>
      <Tab.Item value="feed">피드</Tab.Item>
    </Tab>
  );
}
