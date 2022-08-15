// import { View, Text } from 'react-native'
// import React from 'react'

// const Navigation = () => {
//   return (
//     <View>
//       <Text>Navigation</Text>
//     </View>
//   )
// }

// export default Navigation

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Player from '../../screen/player/Player';
import SongList from '../../screen/songlist/SongList';


const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Player"   screenOptions={{headerShown: false}}>
        <Stack.Screen name="Player" component={Player} />
         <Stack.Screen name="SongList" component={SongList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;