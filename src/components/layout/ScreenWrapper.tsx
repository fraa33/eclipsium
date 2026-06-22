import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/constants/theme';
import { useAnimatedEntry } from '@/hooks/useAnimatedEntry';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

export function ScreenWrapper({
  children,
  scroll = true,
  contentStyle,
  edges = ['top'],
}: Props) {
  const { colors } = useTheme();
  const entry = useAnimatedEntry();

  const padding: StyleProp<ViewStyle> = {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={edges}>
      <Animated.View style={[{ flex: 1 }, entry]}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[padding, contentStyle]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, padding, contentStyle]}>{children}</View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
