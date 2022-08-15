import { View, Text, Image, TouchableOpacity ,PermissionsAndroid,Animated, Easing,} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import cd from '../../assete/images/cd.png'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import {BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import MusicFiles, {
  RNAndroidAudioStore,
} from '@yajanarao/react-native-get-music-files';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

const togglePlayBack = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log(playBackState, State.Paused);
  if (currentTrack != null) {
    if (playBackState == State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }
};

const Player = ({ route, navigation }) => {
 const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-5136668440114711/6398570319';
  const [music, setMusic] = useState();
  const playBackState = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState('off');
   const isMounted = useRef(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackduration, setTrackDuration] = useState('');
   const progress = useProgress();
  const Sheet = useRef(null);
  const spinValue = new Animated.Value(0);

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
    MusicFiles.getAll({
      title: true,
      artist: true,
      album: true,
      duration: true,
      cover: true,
      blured: false,
    })
      .then(async tracks => {
        var list = await tracks.map(item => item);
        const ab = [];
        for (var i = 0; i < list.length; i++) {
          const urlget = {
            url: list[i].path,
            title: list[i].title,
             author:list[i].author,
            duration:
              Math.floor(list[i].duration / 60000) + ':' +
              (((list[i].duration % 60000) / 1000).toFixed(0) < 10 ? '0' : '') +
              ((list[i].duration % 60000) / 1000).toFixed(0),
          };
          const ttt = ab.push(urlget);
        }
        setMusic(ab);
      })
      .catch(error => {
        console.log(error);
      });
  };
 const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stoppingAppPausesPlayback: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play],
    });
    await TrackPlayer.add(music);
  } catch (error) {
    console.log(error);
  }
};
useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      if (event.nextTrack == null) {
        await TrackPlayer.stop();
      } else {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        console.log('track',track)
        const {title, author,duration} = track;
        setTrackTitle(title);
        setTrackArtist(author);
        setTrackDuration(duration);
      }
    }
  });

   const changeRepeatMode = () => {
    if (repeatMode == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }

    if (repeatMode == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }

    if (repeatMode == 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const repeatIcon = () => {
    if (repeatMode == 'off') {
      return 'repeat-off';
    }

    if (repeatMode == 'track') {
      return 'repeat-once';
    }

    if (repeatMode == 'repeat') {
      return 'repeat';
    }
  };


  const skipToNext = () => {
    TrackPlayer.skipToNext();
  };
  const skipTo = async index => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    console.log(index);
  };
  const skipToPrevious = async () => {
    TrackPlayer.skipToPrevious();
    await TrackPlayer.play();
  };
const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  useEffect( () => {
    onClick();
  }, []);
 useEffect( () => {
  Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [progress.position]);

 useEffect(() => {
        if (isMounted.current) {
            if (music.length > 0)
            { setupPlayer();console.log('pass')}
            else {console.log('fail') }
        }  else {
      isMounted.current = true
    }
    }, [music])
  return (
   <LinearGradient style={{flex: 1}} colors={['#aae3d6', '#6be3c7', '#05e3af']}>
      <View style={{borderWidth:5,borderColor:'white'}}>
     <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
  </View>
            <View style={{height:140,justifyContent:'center',paddingHorizontal:20}}>
            <Text style={{color:'black',fontSize:30,fontWeight:'900',fontFamily: 'sans-serif-medium',
             textShadowColor: 'rgba(255, 255, 255, 1)',
             textShadowOffset: {width: -3, height: 1},
             textShadowRadius: 10,
             height:44,
           textTransform: 'uppercase'
          }}>{trackTitle}</Text>
            <Text style={{color:'black',fontSize:20,fontWeight:'900',fontFamily: 'monospace',marginTop:10,
            textShadowColor: 'rgba(255, 255, 255, 1)',
             textShadowOffset: {width: -3, height: 1},
             textShadowRadius: 10,
           textTransform: 'uppercase'
          }}>{trackArtist}</Text>
            </View>
            <View style={{height:400,flexDirection:'row'}}>
            <View style={{height:400,width:'42%'}}>
            <View style={{
            shadowColor: 'black',
            shadowOpacity: 0.8,
            elevation: 10,
            backgroundColor : "#aae3d6",
            shadowRadius: 50 ,
            shadowOffset : { width: 56, height: 13},
            borderWidth:4,
            borderRadius:50,
            borderColor: 'rgba(241, 241, 241, 1)', 
            flex:1,
            margin:10,
            marginHorizontal:50,
            justifyContent:'space-around',
            alignItems:'center'
              }}>
                <TouchableOpacity onPress={changeRepeatMode}>
                <MaterialCommunityIcons
                name={`${repeatIcon()}`}
                size={30}
                color={RepeatMode !== 'off' ? '#fff' : '#fff'}
              />
              </TouchableOpacity>
             <TouchableOpacity onPress={skipToPrevious}>
             <AntDesign name="stepbackward" size={30} color="#fff" />
             </TouchableOpacity>
             <TouchableOpacity
             onPress={() => 
             {togglePlayBack(playBackState);}
            }>
              <AntDesign   name={
                  playBackState === State.Playing
                    ? 'pause'
                    : 'caretright'
                } size={30} color="#fff" />
             </TouchableOpacity>
             <TouchableOpacity onPress={skipToNext}>
             <AntDesign name="stepforward" size={30} color="#fff" />
             </TouchableOpacity>
              </View>
            </View>
            <View style={{height:400,width:'58%'}}>
            <View  
            style={{justifyContent:'center',
            elevation: 25,
            shadowRadius: 50,
             backgroundColor : "#aae3d6",
            shadowColor: 'black',
            shadowOpacity: 0.8,
            borderColor: 'rgba(241, 241, 241, 1)',
            alignItems:'flex-end',
            borderTopWidth:5,
            borderLeftWidth:5,
            flex:1,
            borderTopLeftRadius:200,
            borderBottomLeftRadius:200,  
            shadowOffset: {
            width: 25,
            height: 25
             },
           
            }}>
            <Animated.View style={{width:160,borderTopWidth:5,borderLeftWidth:5,
             elevation: 8,
            shadowRadius: 5,
            shadowColor: 'white',
             shadowOpacity: 0.8,
             height:300,
             borderColor: 'rgba(241, 241, 241, 1)',
             borderTopLeftRadius:200,
             borderBottomLeftRadius:200}}>
              <Animated.Image 
              style={{height:290,width:290,resizeMode:'contain',
              transform: [{ rotate: spin }],}} source={cd}/>
              </Animated.View> 
              </View> 
            </View>
            </View>
                  <View
        style={{
          flexDirection: 'column',
          paddingHorizontal: 40,
          width: '100%',
          height: 20,
        }}>
          <View style={{
            alignItems:'flex-end',
            width:'100%',height:30,
            justifyContent:'space-between',
            flexDirection:'row'}}>
            <Text style={{color:'black',fontSize:15,fontWeight:'900'}}>{
              new Date(progress.position * 1000).toISOString().substr(14, 5)
            }</Text>
            <Text style={{color:'black',fontSize:15,fontWeight:'900'}}>{
               new Date((progress.duration -  progress.position) * 1000).toISOString().substr(14, 5)
              }</Text>
          </View>
        <Slider
          style={{
            height: 20,
            flexDirection: 'row',
            width: '100%',
          }}
            value={progress.position}
          thumbTintColor="#fccb17"
            maximumValue={progress.duration}
          minimumValue={0}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="red"
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
      </View>
            <View style={{flex:1,margin:10,alignItems:'center',marginTop:50}}>
            <TouchableOpacity 
             onPress={() => navigation.navigate('SongList')}
            style={{
              borderWidth:2,
           backgroundColor : "#aae3d6",
           height: 48,
           width: 240,
           borderColor: 'rgba(241, 241, 241, 1)',
           borderRadius: 50,
           shadowOpacity: 1,
           shadowRadius: 50,
           shadowOffset: { width: 0, height: 0 },
           shadowColor: 'black',
           justifyContent:'center',
           alignItems:'center'
            }}
            >
              <Text style={{color:'#000',fontWeight:'900',fontSize:18,
             textShadowColor: 'rgba(255, 255, 255, 1)',
             textShadowOffset: {width: -3, height: 1},
             textShadowRadius: 10
            }}>See All List</Text>
            </TouchableOpacity>

            </View>
                <View style={{borderWidth:5,borderColor:'white'}}>
     <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
  </View>
             
  </LinearGradient>
     
  
  )
}

export default Player