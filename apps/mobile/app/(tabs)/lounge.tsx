import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useColors } from '@/hooks/useColors';

export default function LoungeScreen() {
  const colors = useColors();
  const { players, status, startMatch, resetMatch } = useGame();

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>THE ROYAL LOUNGE</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Choose your court</Text>
        </View>
        <View style={[styles.crown, { backgroundColor: colors.primary }]}>
          <Feather name="award" size={22} color={colors.primaryForeground} />
        </View>
      </View>
      <LinearGradient colors={['#253A5C', '#172139']} style={styles.matchCard}>
        <Text style={styles.matchLabel}>LOCAL MATCH</Text>
        <Text style={styles.matchTitle}>{status === 'playing' ? 'A game is in progress' : 'Your table is waiting'}</Text>
        <Text style={styles.matchCopy}>Pass the device and rule the board together. Every match stays on this device.</Text>
        <View style={styles.roster}>
          {players.map((player) => (
            <View key={player.color} style={styles.rosterItem}>
              <View style={[styles.dot, { backgroundColor: { ruby: '#E65B61', sapphire: '#477DDE', emerald: '#46B890', gold: '#E3B34D' }[player.color] }]} />
              <Text style={styles.rosterText}>{player.name}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Start a fresh match</Text>
      <View style={styles.choices}>
        <Pressable testID="two-player-match" onPress={() => startMatch(2)} style={({ pressed }) => [styles.choice, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}>
          <Feather name="users" size={25} color={colors.primary} />
          <Text style={[styles.choiceTitle, { color: colors.foreground }]}>Duel</Text>
          <Text style={[styles.choiceCopy, { color: colors.mutedForeground }]}>2 players</Text>
        </Pressable>
        <Pressable testID="four-player-match" onPress={() => startMatch(4)} style={({ pressed }) => [styles.choice, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}>
          <Feather name="grid" size={25} color={colors.primary} />
          <Text style={[styles.choiceTitle, { color: colors.foreground }]}>Grand table</Text>
          <Text style={[styles.choiceCopy, { color: colors.mutedForeground }]}>4 players</Text>
        </Pressable>
      </View>
      {status !== 'waiting' && (
        <Pressable testID="reset-match" onPress={resetMatch} style={styles.reset}>
          <Feather name="rotate-ccw" size={16} color={colors.mutedForeground} />
          <Text style={[styles.resetText, { color: colors.mutedForeground }]}>Clear current match</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, padding: 22, paddingBottom: 116, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  title: { fontSize: 29, fontWeight: '800', letterSpacing: -0.8, marginTop: 5 },
  crown: { width: 48, height: 48, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  matchCard: { borderRadius: 26, padding: 22, minHeight: 208 },
  matchLabel: { color: '#E8BE68', fontSize: 11, fontWeight: '800', letterSpacing: 1.7 },
  matchTitle: { color: '#FAF5E9', fontSize: 24, fontWeight: '800', marginTop: 8, letterSpacing: -0.5 },
  matchCopy: { color: '#C8D3E6', fontSize: 14, lineHeight: 20, marginTop: 8, maxWidth: '88%' },
  roster: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 19 },
  rosterItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  rosterText: { color: '#F9F6ED', fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  choices: { flexDirection: 'row', gap: 13 },
  choice: { flex: 1, minHeight: 142, borderWidth: 1, borderRadius: 22, padding: 18, justifyContent: 'flex-end' },
  choiceTitle: { fontSize: 17, fontWeight: '800', marginTop: 18 },
  choiceCopy: { fontSize: 13, marginTop: 3 },
  reset: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, padding: 16 },
  resetText: { fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});