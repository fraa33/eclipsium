import { BarChart3, Dumbbell, Home, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPRING_SOFT } from '@/constants/animations';
import { fontFamily, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';

const TABS: Record<string, { label: string; Icon: typeof Home }> = {
  index: { label: 'Home', Icon: Home },
  stats: { label: 'Progressi', Icon: BarChart3 },
  workout: { label: 'Allena', Icon: Dumbbell },
  profile: { label: 'Profilo', Icon: User },
};

function TabItem({
  focused,
  onPress,
  config,
}: {
  focused: boolean;
  onPress: () => void;
  config: { label: string; Icon: typeof Home };
}) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withSpring(focused ? 1.15 : 1, SPRING_SOFT);
  }, [focused, s]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const color = focused ? theme.colors.accentLight : theme.colors.textMuted;
  const { Icon } = config;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={config.label}
      accessibilityState={{ selected: focused }}
      style={{ flex: 1, alignItems: 'center' }}
    >
      <Animated.View style={[{ alignItems: 'center', gap: 4 }, anim]}>
        <Icon size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
        <Text
          style={{
            fontSize: 11,
            color,
            fontFamily: focused ? fontFamily.semibold : fontFamily.medium,
          }}
        >
          {config.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

interface TabBarLikeProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

export function TabBar({ state, navigation }: TabBarLikeProps) {
  const insets = useSafeAreaInsets();
  const h = useHaptics();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surface2,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: spacing.md,
        paddingBottom: Math.max(insets.bottom, spacing.md),
        paddingHorizontal: spacing.sm,
      }}
    >
      {state.routes.map((route, index) => {
        const config = TABS[route.name];
        if (!config) return null;
        const focused = state.index === index;
        return (
          <TabItem
            key={route.key}
            focused={focused}
            config={config}
            onPress={() => {
              h.light();
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          />
        );
      })}
    </View>
  );
}
