// import { View, Text, PermissionsAndroid } from 'react-native'
// import React, { useEffect } from 'react'
// import MusicFiles, {
//   RNAndroidAudioStore,
// } from '@yajanarao/react-native-get-music-files';

// const App = () => {

//    const onClick = async () => {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple(
//         [
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         ],
//         {
//           title: 'Permission',
//           message: 'Storage access is requiered',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         alert('You can use the package');
//       } else {
//         console.log('again');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//     console.log('click');
//     MusicFiles.getAll({
//       title: true,
//       artist: true,
//       album: true,
//       duration: true,
//       cover: true,
//       blured: false,
//     })
//       .then(async tracks => {
//         console.log(tracks);
//         var list = await tracks.map(item => item);
//         const ab = [];
//         for (var i = 0; i < list.length; i++) {
//           const urlget = {
//             url: list[i].path,
//             title: list[i].title,
//             duration:
//               Math.floor(list[i].duration / 60000) +
//               ':' +
//               (((list[i].duration % 60000) / 1000).toFixed(0) < 10 ? '0' : '') +
//               ((list[i].duration % 60000) / 1000).toFixed(0),
//           };
//           const ttt = ab.push(urlget);
//         }
//         console.log('ab',ab)
//         setMusic(ab);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };
//   useEffect(() => {
//   onClick()
//   }, [])
  
//   return (
//     <View>
//       <Text>App</Text>
//     </View>
//   )
// }

// export default App
import { View, Text } from 'react-native'
import React,{createContext, useState} from 'react'
import Navigation from './src/navigation/mainNavigation/Navigation'
export const GlobalInfo=createContext();

const App = () => {
  const[color,setColor]=useState();
  const getIndex=(index)=>{
setColor(index)
  }
  return (
    <GlobalInfo.Provider value={{appcoloe:color,getIndex:getIndex}}>
    <View style={{flex:1}}>
      
     <Navigation/>
   

    </View>
    </GlobalInfo.Provider>
  )
}

export default App