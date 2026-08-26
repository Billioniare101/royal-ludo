import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LudoBoard } from '@/components/LudoBoard';
import { useGame } from '@/contexts/GameContext';
import { useColors } from '@/hooks/useColors';

const PLAYER_COLORS: Record<string, string> = {
  ruby: '#D8323E',
  sapphire: '#2780D7',
  emerald: '#18B964',
  gold: '#F0B918',
};

const PLAYER_DARK_COLORS: Record<string, string> = {
  ruby: '#741421',
  sapphire: '#0E407E',
  emerald: '#075B39',
  gold: '#936000',
};

function TableTexture() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.textureGlow} />
      {Array.from({ length: 14 }, (_, index) => (
        <View
          key={index}
          style={[
            styles.textureLine,
            {
              top: `${index * 8}%`,
              transform: [{ rotate: '-17deg' }],
            },
          ]}
        />
      ))}
      <View style={styles.textureCornerTop} />
      <View style={styles.textureCornerBottom} />
    </View>
  );
}

function Avatar({ color, large = false }: { color: string; large?: boolean }) {
  return (
    <View
      style={[
        styles.avatar,
        large && styles.avatarLarge,
        { borderColor: PLAYER_COLORS[color] ?? PLAYER_COLORS.ruby },
      ]}
    >
      <View style={[styles.avatarHead, large && styles.avatarHeadLarge]} />
      <View style={[styles.avatarBody, large && styles.avatarBodyLarge, { backgroundColor: PLAYER_COLORS[color] ?? PLAYER_COLORS.ruby }]} />
    </View>
  );
}

function DiceFace({ value }: { value: number | null }) {
  const activeDots: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  const dots = value ? activeDots[value] : [];

  return (
    <View style={styles.diceFace}>
      <View style={styles.diceDots}>
        {Array.from({ length: 9 }, (_, index) => (
          <View key={index} style={[styles.diceDot, dots.includes(index) && styles.diceDotActive]} />
        ))}
      </View>
      {value === null ? <Text style={styles.diceQuestion}>?</Text> : null}
    </View>
  );
}

function PlayerPlaque({
  name,
  color,
  progress,
  active,
}: {
  name: string;
  color: string;
  progress: number;
  active: boolean;
}) {
  return (
    <View
      style={[
        styles.playerPlaque,
        {
          backgroundColor: active ? PLAYER_DARK_COLORS[color] : 'rgba(22, 8, 28, 0.68)',
          borderColor: active ? PLAYER_COLORS[color] : 'rgba(231, 190, 104, 0.27)',
        },
      ]}
    >
      <View style={[styles.plaqueToken, { backgroundColor: PLAYER_COLORS[color] }]}>
        <Feather name="circle" size={11} color="#FFF2C6" />
      </View>
      <View style={styles.plaqueCopy}>
        <Text style={[styles.plaqueName, { color: active ? '#FFF5D5' : '#C8B9C4' }]}>{name}</Text>
        <Text style={[styles.plaqueProgress, { color: active ? '#F3D47D' : '#8F7A8C' }]}>{progress} / 56</Text>
      </View>
      {active ? <Feather name="chevron-right" size={13} color="#F3D47D" /> : null}
    </View>
  );
}

export default function PlayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { players, currentTurn, lastRoll, status, winner, rollDice, startMatch } = useGame();
  const activePlayer = (status === 'playing' ? players[currentTurn] : players[0]) ?? players[0];

  if (!activePlayer) return null;

  if (status === 'waiting') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={['#3A163F', '#1A0B24', '#0E0715']} style={styles.waitingPage}>
          <TableTexture />
          <ScrollView
            contentContainerStyle={[
              styles.waitingContent,
              { paddingTop: Math.max(insets.top + 8, 28), paddingBottom: insets.bottom + 28 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brandRow}>
              <View style={styles.brandLockup}>
                <View style={styles.brandCrown}>
                  <Feather name="award" size={16} color="#261025" />
                </View>
                <View>
                  <Text style={styles.brandOverline}>ROYAL LUDO</Text>
                  <Text style={styles.brandSubline}>THE CLASSIC TABLE</Text>
                </View>
              </View>
              <View style={styles.iconCluster}>
                <View style={styles.iconButton}><Feather name="log-in" size={17} color="#E8C878" /></View>
                <View style={styles.iconButton}><Feather name="settings" size={17} color="#E8C878" /></View>
              </View>
            </View>

            <View style={styles.waitingIntro}>
              <Text style={styles.waitingKicker}>A TABLE OF LEGACY</Text>
              <Text style={styles.waitingTitle}>Bring the court to life.</Text>
              <Text style={styles.waitingCopy}>
                Four colours. One crown. Roll your way from the home court to the centre.
              </Text>
            </View>

            <View style={styles.waitingBoard}>
              <LudoBoard players={players} />
            </View>

            <Pressable
              testID="quick-start"
              onPress={() => startMatch(4)}
              style={({ pressed }) => [styles.startButtonWrap, pressed && styles.pressed]}
            >
              <LinearGradient colors={['#FFE49A', '#D29B2D', '#9B6513']} style={styles.startButton}>
                <Feather name="play" size={16} color="#291126" />
                <Text style={styles.startButtonText}>Start Grand Table</Text>
                <Feather name="chevron-right" size={18} color="#291126" />
              </LinearGradient>
            </Pressable>
            <Text style={styles.waitingFootnote}>LOCAL MATCH  •  UP TO FOUR PLAYERS</Text>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#3A163F', '#1A0B24', '#0E0715']} style={styles.playPage}>
        <TableTexture />
        <ScrollView
          contentContainerStyle={[
            styles.playContent,
            { paddingTop: Math.max(insets.top + 8, 28), paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandLockup}>
              <View style={styles.brandCrownSmall}>
                <Feather name="award" size={14} color="#291126" />
              </View>
              <View>
                <Text style={styles.brandOverline}>ROYAL LUDO</Text>
                <Text style={styles.brandSubline}>THE CLASSIC TABLE</Text>
              </View>
            </View>
            <View style={styles.localPill}>
              <View style={styles.localDot} />
              <Text style={styles.localText}>LOCAL</Text>
            </View>
          </View>

          <View style={styles.playIntro}>
            <View>
              <Text style={styles.playKicker}>MATCH IN PROGRESS</Text>
              <Text style={styles.playTitle}>The court is yours.</Text>
            </View>
            <View style={styles.playerCount}>
              <Feather name="users" size={13} color="#E8C878" />
              <Text style={styles.playerCountText}>{players.length} PLAYERS</Text>
            </View>
          </View>

          <View style={styles.tableStage}>
            <View style={styles.cornerOrnamentTop}><Feather name="star" size={11} color="#D7A64F" /></View>
            <View style={styles.cornerOrnamentBottom}><Feather name="star" size={11} color="#D7A64F" /></View>
            <LudoBoard players={players} />
          </View>

          <View style={styles.controlDock}>
            <View style={[styles.turnPanel, { borderColor: PLAYER_COLORS[activePlayer.color] }]}>
              <Avatar color={activePlayer.color} large />
              <View style={styles.turnCopy}>
                <Text style={styles.turnKicker}>{winner ? 'MATCH COMPLETE' : 'NOW PLAYING'}</Text>
                <Text style={styles.turnTitle}>{winner ? `${winner} wins the crown` : activePlayer.name}</Text>
                <Text style={styles.turnHint}>{winner ? 'A royal finish at 56 steps' : lastRoll ? `Rolled ${lastRoll} · ${lastRoll === 6 ? 'roll again' : 'next court'}` : 'Roll the dice to move'}</Text>
              </View>
            </View>
            <View style={styles.dicePanel}>
              <Text style={styles.diceLabel}>LAST ROLL</Text>
              <DiceFace value={lastRoll} />
            </View>
          </View>

          <Pressable
            testID="roll-dice"
            disabled={!!winner}
            onPress={rollDice}
            style={({ pressed }) => [styles.rollButtonWrap, pressed && !winner && styles.pressed, !!winner && styles.rollButtonDisabled]}
          >
            <LinearGradient colors={winner ? ['#604A5A', '#392439'] : ['#FFE49A', '#D29B2D', '#9B6513']} style={styles.rollButton}>
              <Feather name={winner ? 'award' : 'refresh-cw'} size={18} color={winner ? '#B6A2B5' : '#291126'} />
              <Text style={[styles.rollButtonText, winner && styles.rollButtonTextDisabled]}>
                {winner ? 'Victory secured' : 'Roll royal dice'}
              </Text>
              {!winner ? <Text style={styles.rollButtonShortcut}>TAP</Text> : null}
            </LinearGradient>
          </Pressable>

          <View style={styles.playersHeader}>
            <Text style={styles.playersTitle}>PLAYERS AT THE TABLE</Text>
            <Text style={styles.playersHint}>PROGRESS</Text>
          </View>
          <View style={styles.playerGrid}>
            {players.map((player, index) => (
              <PlayerPlaque
                key={player.color}
                name={player.name}
                color={player.color}
                progress={player.progress}
                active={index === currentTurn && !winner}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  waitingPage: { flex: 1 },
  playPage: { flex: 1 },
  waitingContent: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  playContent: {
    paddingHorizontal: 12,
    alignItems: 'stretch',
  },
  textureGlow: {
    position: 'absolute',
    width: '120%',
    height: 260,
    top: -50,
    left: '-10%',
    backgroundColor: 'rgba(191, 76, 151, 0.12)',
    borderRadius: 999,
  },
  textureLine: {
    position: 'absolute',
    left: '-22%',
    width: '145%',
    height: 28,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(231, 174, 206, 0.055)',
  },
  textureCornerTop: {
    position: 'absolute',
    top: 100,
    left: -60,
    width: 190,
    height: 190,
    borderWidth: 1,
    borderColor: 'rgba(231, 174, 206, 0.06)',
    borderRadius: 90,
    transform: [{ rotate: '28deg' }],
  },
  textureCornerBottom: {
    position: 'absolute',
    right: -80,
    bottom: 80,
    width: 240,
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(231, 174, 206, 0.05)',
    borderRadius: 120,
    transform: [{ rotate: '-24deg' }],
  },
  brandRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandCrown: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8C878',
    borderWidth: 1,
    borderColor: '#FFF0B6',
  },
  brandCrownSmall: {
    width: 29,
    height: 29,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8C878',
    borderWidth: 1,
    borderColor: '#FFF0B6',
  },
  brandOverline: {
    color: '#F7E3A7',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.3,
  },
  brandSubline: {
    color: '#A98EA7',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginTop: 2,
  },
  iconCluster: { flexDirection: 'row', gap: 7 },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(46, 21, 51, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(232, 200, 120, 0.28)',
  },
  waitingIntro: {
    width: '100%',
    marginTop: 28,
    marginBottom: 16,
  },
  waitingKicker: {
    color: '#E8C878',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  waitingTitle: {
    color: '#FFF4D2',
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 7,
  },
  waitingCopy: {
    color: '#C5AEC3',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 310,
    marginTop: 7,
  },
  waitingBoard: {
    width: '100%',
    maxWidth: 410,
    marginVertical: 4,
  },
  startButtonWrap: {
    width: '100%',
    maxWidth: 380,
    marginTop: 18,
    borderRadius: 13,
    shadowColor: '#E4B85C',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.27,
    shadowRadius: 12,
    elevation: 7,
  },
  startButton: {
    minHeight: 56,
    paddingHorizontal: 17,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FFEAB0',
  },
  startButtonText: {
    color: '#291126',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
  },
  waitingFootnote: {
    color: '#8F7A8C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
    marginTop: 13,
  },
  localPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(93, 220, 150, 0.37)',
    backgroundColor: 'rgba(26, 88, 58, 0.42)',
  },
  localDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#55D890' },
  localText: { color: '#86E9AE', fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  playIntro: {
    marginTop: 21,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  playKicker: { color: '#E8C878', fontSize: 9, fontWeight: '900', letterSpacing: 1.7 },
  playTitle: { color: '#FFF4D2', fontSize: 25, lineHeight: 29, fontWeight: '800', marginTop: 5 },
  playerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 3,
  },
  playerCountText: { color: '#B89EB5', fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  tableStage: {
    width: '100%',
    padding: 7,
    position: 'relative',
    borderRadius: 16,
    backgroundColor: 'rgba(36, 17, 26, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 86, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  cornerOrnamentTop: {
    position: 'absolute',
    left: 13,
    top: 13,
    zIndex: 4,
  },
  cornerOrnamentBottom: {
    position: 'absolute',
    right: 13,
    bottom: 13,
    zIndex: 4,
  },
  controlDock: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    marginTop: 11,
  },
  turnPanel: {
    flex: 1,
    minHeight: 82,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 13,
    borderWidth: 1,
    backgroundColor: 'rgba(38, 17, 43, 0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#E6E0DB',
    borderWidth: 2,
  },
  avatarLarge: { width: 45, height: 45, borderRadius: 23 },
  avatarHead: {
    position: 'absolute',
    top: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFDF4',
    borderWidth: 1,
    borderColor: '#D4CCC2',
  },
  avatarHeadLarge: { top: 7, width: 17, height: 17, borderRadius: 9 },
  avatarBody: {
    width: 24,
    height: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    opacity: 0.88,
  },
  avatarBodyLarge: { width: 30, height: 19, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  turnCopy: { flex: 1, minWidth: 0 },
  turnKicker: { color: '#D8B865', fontSize: 8, fontWeight: '900', letterSpacing: 1.25 },
  turnTitle: { color: '#FFF3D0', fontSize: 16, fontWeight: '900', marginTop: 3 },
  turnHint: { color: '#BDA5B9', fontSize: 9, marginTop: 3 },
  dicePanel: {
    width: 79,
    minHeight: 82,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(38, 17, 43, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 86, 0.38)',
  },
  diceLabel: { color: '#9D8498', fontSize: 7, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  diceFace: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F9F0D7',
    borderWidth: 2,
    borderColor: '#C08A2F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  diceDots: {
    width: 26,
    height: 26,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diceDot: { width: 6, height: 6, borderRadius: 3 },
  diceDotActive: { backgroundColor: '#5B2A37' },
  diceQuestion: { position: 'absolute', color: '#8C6A53', fontSize: 22, fontWeight: '900' },
  rollButtonWrap: {
    width: '100%',
    marginTop: 9,
    borderRadius: 13,
    shadowColor: '#DDAA45',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 9,
    elevation: 6,
  },
  rollButtonDisabled: { shadowOpacity: 0 },
  rollButton: {
    height: 53,
    borderRadius: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FFEAB0',
  },
  rollButtonText: { color: '#291126', fontSize: 15, fontWeight: '900', flex: 1 },
  rollButtonTextDisabled: { color: '#C7B7C5' },
  rollButtonShortcut: { color: '#6E4317', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  playersHeader: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playersTitle: { color: '#E8C878', fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  playersHint: { color: '#866F82', fontSize: 8, fontWeight: '800', letterSpacing: 1.1 },
  playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  playerPlaque: {
    width: '48.8%',
    minHeight: 48,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  plaqueToken: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.47)',
  },
  plaqueCopy: { flex: 1 },
  plaqueName: { fontSize: 11, fontWeight: '900' },
  plaqueProgress: { fontSize: 9, fontWeight: '700', marginTop: 2 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});