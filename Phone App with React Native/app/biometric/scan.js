import { SafeAreaView } from 'react-native';
import { Dimensions, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, FONTS, SIZES, icons, images } from '../../constants';

export default function Scan() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Text style={{ ...FONTS.h1, color: COLORS.black, textAlign: 'center' }}>
        Camera Feed
      </Text>
      <WebView
        source={{ uri: 'https://project-video-chat-client-smart-cradle-y99i.vercel.app' }}
        style={{
          height: height,
          width,
          resizeMode: 'cover',
          flex: 1,
        }}
        scalesPageToFit={false}
      />
    </SafeAreaView>
  );
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
