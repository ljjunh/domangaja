import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Pretendard-Bold' }}>Home</Text>
      <Text style={{ fontFamily: 'Pretendard-Thin' }}>Home</Text>
      <Text style={{ fontFamily: 'Pretendard-Regular' }}>세상에 이런 폰트가 나오다니 천재인듯</Text>
      <Button title="피드디테일로 이동" onPress={() => navigation.navigate('FeedDetail')} />
    </View>
  );
}
