import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { styles } from '../styles/terminal.styles';
import {
  Terminal as TermIcon,
  Play,
  RotateCcw,
  Trash2,
  HelpCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export default function Terminal({
  terminalLines,
  onExecuteCommand,
  onNavigateHistory,
  onClear,
}) {
  const [inputVal, setInputVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isWrapMode, setIsWrapMode] = useState(false);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  const { isDark, colors } = useTheme();
  const { t } = useLanguage();
  const { scrollRef: chipsScrollRef, scrollBy: scrollChipsBy, canScrollLeft, canScrollRight } = useHorizontalScroll();

  const commands = [
    { label: t('cmdListRunning', 'List Running'), cmd: 'docker ps' },
    { label: t('cmdListAll', 'List All'), cmd: 'docker ps -a' },
    { label: t('cmdRunNginx', 'Run Nginx (8080:80)'), cmd: 'docker run -d -p 8080:80 --name web-server nginx:alpine' },
    { label: t('cmdBuildApp', 'Build App (docker build)'), cmd: 'docker build -t my-app .' },
    { label: t('cmdRunDev', 'Live Code Run (:4000)'), cmd: 'docker run -d -p 4000:3000 -v $(pwd):/app --name my-app-dev my-app' },
    { label: t('cmdTestApp', 'Test App (:4000)'), cmd: 'curl http://localhost:4000' },
    { label: t('cmdTestWeb', 'Test Web Server'), cmd: 'curl http://localhost:8080' },
    { label: t('cmdRunRedis', 'Run Redis'), cmd: 'docker run -d --name redis-cache redis:alpine' },
    { label: t('cmdCreateNet', 'Create Network'), cmd: 'docker network create app-net' },
    { label: t('cmdComposeUp', 'Compose Up'), cmd: 'docker compose up -d' },
    { label: t('cmdInspectLogs', 'Inspect Logs'), cmd: 'docker logs web-server' },
  ];

  // Auto-scroll on new terminal line
  useEffect(() => {
    if (scrollViewRef.current) {
      if (typeof scrollViewRef.current.scrollToEnd === 'function') {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [terminalLines]);

  const handleSubmit = () => {
    if (!inputVal.trim()) return;
    onExecuteCommand(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (Platform.OS === 'web') {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = onNavigateHistory('up');
        if (prev !== undefined) setInputVal(prev);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = onNavigateHistory('down');
        if (next !== undefined) setInputVal(next);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const candidates = [
          'docker ps',
          'docker ps -a',
          'docker images',
          'docker run -d -p 8080:80 --name web-server nginx:alpine',
          'docker stop ',
          'docker start ',
          'docker logs ',
          'docker inspect ',
          'docker network ls',
          'docker network create ',
          'docker volume ls',
          'docker compose up -d',
          'docker compose down',
          'curl http://localhost:8080',
          'curl http://localhost:3000',
        ];
        const match = candidates.find(c => c.startsWith(inputVal.trim()));
        if (match) setInputVal(match);
      }
    }
  };

  return (
    <View style={[styles.terminalContainer, { backgroundColor: colors.termBg, borderColor: colors.cardBorder }]}>
      {/* Terminal Title Bar */}
      <View style={[styles.titleBar, { backgroundColor: colors.termFrame, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.macButtons}>
          <View style={[styles.dot, styles.dotRed]} />
          <View style={[styles.dot, styles.dotYellow]} />
          <View style={[styles.dot, styles.dotGreen]} />
        </View>

        <View style={styles.termTitleRow}>
          <TermIcon size={13} color={colors.primary} />
          <Text style={[styles.termTitleText, { color: colors.text }]}>{t('termUser', 'root@docker-sandbox: ~ (bash 5.2)')}</Text>
          <Text style={[styles.termShortcutHint, { color: colors.textMuted }]}>{t('termShortcutHint', 'Tab ⇥ Complete  •  ↑↓ History')}</Text>
        </View>

        <View style={styles.termActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.cardSubBg }]}
            onPress={() => onExecuteCommand('help')}
            title={t('helpBtn', 'Help')}
          >
            <HelpCircle size={13} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.cardSubBg }]}
            onPress={() => onExecuteCommand('clear')}
            title={t('clearBtn', 'Clear')}
          >
            <Trash2 size={13} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Terminal Output Area */}
      <ScrollView
        ref={scrollViewRef}
        style={[styles.outputScroll, { backgroundColor: colors.termBg }]}
        contentContainerStyle={styles.outputContent}
        showsVerticalScrollIndicator={true}
      >
        {terminalLines.map((line) => {
          if (line.type === 'input') {
            return (
              <View key={line.id} style={styles.inputEchoRow}>
                <Text style={styles.promptUser}>root@docker-sandbox</Text>
                <Text style={styles.promptColon}>:</Text>
                <Text style={styles.promptDir}>~</Text>
                <Text style={styles.promptSymbol}>#</Text>
                <Text style={styles.cmdEchoText}>{line.text}</Text>
              </View>
            );
          }

          let lineStyle = styles.outputDefault;
          if (line.type === 'error') lineStyle = styles.outputError;
          if (line.type === 'success') lineStyle = styles.outputSuccess;
          if (line.type === 'info') lineStyle = styles.outputInfo;
          if (line.type === 'hint') lineStyle = styles.outputHint;

          return (
            <Text key={line.id} style={[styles.lineBase, lineStyle]} selectable={true}>
              {line.text}
            </Text>
          );
        })}
      </ScrollView>

      {/* Terminal Input Line */}
      <View style={[styles.inputArea, { backgroundColor: colors.cardBg, borderTopColor: colors.cardBorder }]}>
        <View style={styles.inputPrompt}>
          <Text style={styles.promptSymbolGreen}>➜</Text>
          <Text style={[styles.promptPath, { color: colors.primary }]}>docker</Text>
        </View>

        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
            isFocused && [styles.textInputFocused, { borderColor: colors.primary }]
          ]}
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={handleSubmit}
          onKeyPress={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t('termInputPlaceholder', 'Type docker command (e.g. docker ps, docker run...)')}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />

        <TouchableOpacity
          style={[styles.runButton, { backgroundColor: colors.accent || '#238636' }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Play size={13} color="#ffffff" />
          <Text style={styles.runButtonText}>{t('runBtn', 'Run')}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Interactive Command Chips */}
      <View style={[styles.quickCommandsBar, { backgroundColor: colors.cardBg, borderTopColor: colors.cardBorder }]}>
        <View style={styles.quickHeaderRow}>
          <View style={styles.quickHeaderLeft}>
            <Sparkles size={11} color={colors.primary} />
            <Text style={[styles.quickHeaderText, { color: colors.textMuted }]}>
              {t('quickCommandsTitle', 'Quick Commands:')}
            </Text>
            {!isWrapMode && (
              <Text style={[styles.quickScrollHint, { color: colors.textMuted }]}>
                {t('scrollHint', 'Scroll with wheel / ◄ ►')}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.viewModeToggle, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}
            onPress={() => setIsWrapMode(!isWrapMode)}
            activeOpacity={0.7}
            title={isWrapMode ? t('compactView', 'Scrollable') : t('viewAll', 'View All')}
          >
            {isWrapMode ? (
              <>
                <List size={11} color={colors.primary} />
                <Text style={[styles.viewModeText, { color: colors.primary }]}>{t('compactView', 'Scrollable')}</Text>
              </>
            ) : (
              <>
                <LayoutGrid size={11} color={colors.textMuted} />
                <Text style={[styles.viewModeText, { color: colors.textMuted }]}>{t('viewAll', 'View All')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isWrapMode ? (
          <View style={styles.chipsWrapContainer}>
            {commands.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                onPress={() => onExecuteCommand(item.cmd)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipLabel, { color: colors.primary }]}>{item.label}</Text>
                <Text style={[styles.chipCmd, { color: colors.textSub }]}>{item.cmd}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.chipsCarouselRow}>
            <TouchableOpacity
              style={[
                styles.scrollArrowBtn,
                { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder },
                !canScrollLeft && { opacity: 0.4 }
              ]}
              onPress={() => scrollChipsBy(-220)}
              activeOpacity={0.7}
              title="Scroll Left"
            >
              <ChevronLeft size={14} color={colors.text} />
            </TouchableOpacity>

            <ScrollView
              ref={chipsScrollRef}
              horizontal
              showsHorizontalScrollIndicator={true}
              style={styles.quickScrollView}
              contentContainerStyle={styles.quickChipsScroll}
            >
              {commands.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.chip, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  onPress={() => onExecuteCommand(item.cmd)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipLabel, { color: colors.primary }]}>{item.label}</Text>
                  <Text style={[styles.chipCmd, { color: colors.textSub }]}>{item.cmd}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.scrollArrowBtn,
                { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder },
                !canScrollRight && { opacity: 0.4 }
              ]}
              onPress={() => scrollChipsBy(220)}
              activeOpacity={0.7}
              title="Scroll Right"
            >
              <ChevronRight size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
