import React, { useEffect, useState, useRef } from 'react';
import { Viro360Image, ViroARImageMarker, ViroARScene, ViroBox, ViroButton, ViroMaterials, ViroNode, ViroQuad, ViroText } from '@reactvision/react-viro';
import { StyleSheet, TouchableOpacity, Text, View, StyleProp, ViewStyle } from 'react-native';

const ARScene = () => {
  return (
    <ViroARScene>
        <ViroARImageMarker target={"qrCode"}>
            <ViroButton
                source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
                position={[0, 0, 0]}
                height={1}
                width={1}
                rotation={[0, 90, 90]}
                scale={[.07, .07, .07]}
                onClick={() => console.log("Clicked")}
                transformBehaviors={["billboard"]}
            />
            <ViroText
                text="Hello in AR3!"
                scale={[0.1, 0.1, 0.1]}
                rotation={[0, 0, 0]}
                position={[0, -10, -1]}
                style={{ fontFamily: 'Arial', fontSize: 30, color: '#ff0000' }}
                />
        </ViroARImageMarker>
    </ViroARScene>
  );
};

export default ARScene;
