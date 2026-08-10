import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/components/layout';
import { MAIN_TAB_SCREEN_EDGES } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { FeedList, StoryList } from '@/domains/feed/components';
import { CommunityFab, CommunityTabs, type CommunityTabValue } from './components';

export default function FeedScreen() {
  const navigation = useNavigation();
  const mainTabBarSpace = useMainTabBarSpace();
  const [tab, setTab] = useState<CommunityTabValue>('story');

  const handlePressFab = () => {
    if (tab === 'story') {
      navigation.navigate('StoryWrite');
    } else {
      navigation.navigate('FeedWrite');
    }
  };

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <CommunityTabs value={tab} onChange={setTab} />
      {tab === 'story' ? (
        <StoryList bottomInset={mainTabBarSpace} />
      ) : (
        <FeedList bottomInset={mainTabBarSpace} />
      )}
      <CommunityFab onPress={handlePressFab} bottomOffset={mainTabBarSpace + 12} />
    </Layout>
  );
}
