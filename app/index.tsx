import type { Room } from "@/types";

import { StyleSheet, View, Text, FlatList, TouchableHighlight } from 'react-native';
import { useEffect, useState } from 'react';
import { ImageBackground } from 'expo-image';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';

import { createGame, getAllRooms } from '@/service';
import { RoomCard } from "@/components/home/RoomCard";
import { UserCard } from "@/components/home/UserCard";
import { Login } from "@/components/home/Login";
import { useUser } from '@/contexts/UserContext';

import { ThemeConfig } from "@/constants/ThemeConfig";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  // 检查页面是否处于焦点状态，页面返回刷新列表数据
  const isFocused = useIsFocused();
  const [rooms, setRooms] = useState<Room[]>();
  const { user } = useUser();
  const router = useRouter();

  const createRoom = async () => {
    const { roomId } = await createGame({
      lowestBetAmount: 100,
      maximumCountOfPlayers: 10,
      allowPlayersToWatch: true
    })
    
    // 创建房间后，跳转到房间页面
    router.push({ pathname: '/game', params: { roomId, ownerId: user?.id } })
  }

  const fetchData = async () => {
    const rooms = await getAllRooms();

    setRooms(rooms);
  };

  useEffect(() => {
    if (user && isFocused) {
      fetchData();
    }
  }, [isFocused, user]);

  return (
    <ImageBackground
      contentFit="cover"
      source={ThemeConfig.gameBackImg}
      style={styles.container}
    >
      <View style={styles.infos}>
        {
          user ? (
            <>
              <UserCard />

              <TouchableHighlight underlayColor="#999" onPress={createRoom} style={styles.cycle}>
                <Text style={styles.startBtn}>创建房间</Text>
              </TouchableHighlight>
            </>
          ) : (
            <Login />
          )
        }
      </View>

      {
        rooms?.length === 0 ? (
          <View style={styles.rooms}>
            <LottieView
              source={ThemeConfig.roomEmptyLottie}
              autoPlay
              loop
              style={styles.emptyList}
              resizeMode='cover'
            />
          </View>
        ) : (
          <FlatList
            style={styles.rooms}
            data={rooms}
            renderItem={({ item, index }) => <RoomCard key={index} refresh={fetchData} room={item} />}
            keyExtractor={item => item?.id}
          />
        )
      }
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: ThemeConfig.homeBackColor,
    width: '100%',
    height: '100%'
  },

  backgroundAnimation: {
    position: 'absolute',
    width: '40%',
    height: '100%',
    zIndex: -1, // 将动画置于底层
  },

  infos: {
    width: '40%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12
  },

  rooms: {
    width: '60%',
    height: '100%',
  },

  emptyList: {
    width: '100%',
    height: '100%',
  },

  cycle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#1677ff'
  },

  startBtn: {
    color: '#fff'
  }
});
