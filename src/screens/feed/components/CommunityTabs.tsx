import { useTranslation } from 'react-i18next';
import { Tab } from '@/shared/components/ui';

export type CommunityTabValue = 'story' | 'feed';

interface CommunityTabsProps {
  value: CommunityTabValue;
  onChange: (value: CommunityTabValue) => void;
}

export default function CommunityTabs({ value, onChange }: CommunityTabsProps) {
  const { t } = useTranslation();
  return (
    <Tab value={value} onChange={next => onChange(next as CommunityTabValue)}>
      <Tab.Item value="story">{t('feed.tabs.story')}</Tab.Item>
      <Tab.Item value="feed">{t('feed.tabs.feed')}</Tab.Item>
    </Tab>
  );
}
