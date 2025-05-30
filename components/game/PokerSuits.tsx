import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Suit } from 'texas-poker-core';

// 渲染黑桃
const Spade = () => (
  <Svg style={styles.svg}>
    <Path
      fill="#010101"
      d="M36.067 10.646C29.462 25.327 11.332 27.309 9.35 39.199 7.441 51.017 22.636 58.356 33.572 49.988c1.468 3.084-.367 8.001-3.377 12.111 1.541-.513 4.624-.733 5.872-.733s4.33.221 5.872.733c-3.01-4.11-4.771-9.027-3.377-12.111 12.772 7.928 26.352.882 24.443-10.789-2.055-12.551-20.331-13.872-26.938-28.553z"
    />
  </Svg>
);

const Heart = () => {
  return (
    <Svg style={styles.svg}>
      <Path
        fill="#ED2224"
        d="M35.84 21.358c-11.368-11.92-27-6-27 9 0 14.684 14.842 18.631 21.158 24.947.947.947 3.711 3.474 5.921 7.895 2.289-4.421 4.974-6.947 5.921-7.895 6-6.316 21-10.264 21-24.632 0-15.315-15.789-21.235-27-9.315z"
      />
    </Svg>
  );
};

const Club = () => {
  return (
    <Svg style={styles.svg}>
      <Path
        fill="#0A0B0B"
        d="M19.21 28.22c-12.744 0-12.976 16.22 0 16.22 7.647 0 11.818-7.491 14.367-4.865 2.395 2.472-1.391 15.911-1.699 18.073-.464 2.936 2.008 5.253 4.712 5.253 2.857 0 4.865-2.317 4.325-5.253-.387-2.162-3.785-15.524-1.313-18.073 2.395-2.472 7.029 4.942 15.217 4.865 11.662-.076 11.662-16.22 0-16.22-8.033 0-12.745 7.415-15.217 4.943-2.317-2.317 4.943-5.021 4.943-12.899 0-11.432-16.065-11.432-16.065-.077 0 7.956 7.492 10.736 5.098 12.976-2.627 2.472-6.721-4.943-14.368-4.943z"
      />
    </Svg>
  );
};

const Diamond = () => {
  return (
    <Svg style={styles.svg}>
      <Path
        fill="#ED2224"
        d="M36.143 9.601c-5.631 9.257-16.662 20.982-25.688 27.154 9.026 5.708 20.057 17.896 25.688 26.846 5.632-8.949 17.28-21.138 25.998-27.077-8.718-5.941-20.367-17.667-25.998-26.923z"
      />
    </Svg>
  );
};

const PokerSuits = ({ type }: { type: Suit }) => {
  return (
    <View style={styles.container}>
      {type === 's' && <Spade />}
      {type === 'h' && <Heart />}
      {type === 'c' && <Club />}
      {type === 'd' && <Diamond />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  svg: {
    width: 72,
    height: '100%'
  }
});

export default PokerSuits;
