import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { MAIN_TAB_SCREEN_EDGES } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { FeedList, StoryList } from '@/domains/feed/components';
import { CommunityTabs, type CommunityTabValue } from './components';

export default function FeedScreen() {
  const mainTabBarSpace = useMainTabBarSpace();
  const [tab, setTab] = useState<CommunityTabValue>('story');

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <CommunityTabs value={tab} onChange={setTab} />
      {tab === 'story' ? (
        <StoryList bottomInset={mainTabBarSpace} />
      ) : (
        <FeedList bottomInset={mainTabBarSpace} />
      )}
    </Layout>
  );
}
