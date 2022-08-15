import { View, Text,FlatList ,TouchableOpacity,PermissionsAndroid} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import {BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import { LogBox } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MusicFiles, {
  RNAndroidAudioStore,
} from '@yajanarao/react-native-get-music-files';
import{GlobalInfo} from '../../../App.js'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
LogBox.ignoreLogs(['new NativeEventEmitter']);



const SongList = ({navigation}) => {
const[songs ,setSongs]=useState('');
 const{appcoloe,getIndex}=useContext(GlobalInfo)

 const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-5136668440114711/6398570319';

    const onClick = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
        {
          title: 'Permission',
          message: 'Storage access is requiered',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        alert('You can use the package');
      } else {
        console.log('again');
      }
    } catch (err) {
      console.warn(err);
    }
    console.log('click');
    MusicFiles.getAll({
      title: true,
      artist: true,
      album: true,
      duration: true,
      cover: true,
      blured: false,
    })
      .then(async tracks => {
        setSongs(tracks)
        console.log(tracks);
        var list = await tracks.map(item => item);
        const ab = [];
        for (var i = 0; i < list.length; i++) {
          const urlget = {
            url: list[i].path,
            title: list[i].title,
            author:list[i].author,
            duration:
              Math.floor(list[i].duration / 60000) +
              ':' +
              (((list[i].duration % 60000) / 1000).toFixed(0) < 10 ? '0' : '') +
              ((list[i].duration % 60000) / 1000).toFixed(0),
          };
          const ttt = ab.push(urlget);
        }
        console.log('ab',ab)
        setMusic(ab);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
  onClick()
  }, [])
    const skipTo = async index => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    console.log(index);
  };

    
  return (
   <LinearGradient style={{flex: 1}} colors={['#aae3d6', '#6be3c7', '#05e3af']}>
        <View style={{flex: 1}}>
    <View style={{borderWidth:5,borderColor:'white'}}>
     <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
  </View>
  
      <FlatList
        data={songs}
        keyExtractor={(item, index) => String(index)}
        renderItem={({index, item}) => {
          //   console.log(item);
          return (
            <>
              <TouchableOpacity
            onPress={() => skipTo(index)}
                style={{
                shadowColor: 'black',
                  shadowOpacity: 0.8,
                 elevation: 10,
                  backgroundColor : "#aae3d6",
                  height: 65,
                  borderRadius: 50,
                  borderWidth:2,
                  marginVertical: 20  ,
                  marginHorizontal:20, 
                  borderColor:'#fff' ,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent:'space-between',
                  paddingHorizontal:10
        
                }}>
                    <View style={{borderWidth:2,height:50,width:'15%',borderRadius:50,borderColor:'white',
                justifyContent:'center',alignItems:'center'
                }}>
                      <MaterialCommunityIcons name="music-circle" size={43} color="#fff" />  
                    </View>
                    <View style={{height:50,width:'80%',borderRadius:10}}>
                        <Text style={{color:'#000',fontWeight:'700',fontSize:15,
             textShadowColor: 'rgba(255, 255, 255, 1)',
             textShadowOffset: {width: -3, height: 1},
             textShadowRadius: 10,
             height:22,
             textTransform: 'uppercase'
            }}>{item.title}</Text>
                        <Text 
                        style={{color:'#000',fontWeight:'700',fontSize:12,
             textShadowColor: 'rgba(225, 255, 255, 1)',
             textShadowOffset: {width: -3, height: 1},
             textShadowRadius: 10,
             height:25,
              textTransform: 'uppercase'
            }}>{item.author}</Text>
                    </View>
              </TouchableOpacity>
              {index % 3 === 0 ? (
              <View style={{borderWidth:5,borderColor:'white'}}>
            <BannerAd
             unitId={adUnitId}
             size={BannerAdSize.FULL_BANNER}
             requestOptions={{
            requestNonPersonalizedAdsOnly: true,
        }}
      />
  </View>
              ) : null}
            </>
          );
        }}
      />
    </View>

   </LinearGradient>
  )
}

export default SongList