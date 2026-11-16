import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Terminal as TermIcon,
  Play,
  RotateCcw,
  Trash2,
  HelpCircle,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const COMMON_COMMANDS = [
  { label: 'List Running', cmd: 'docker ps' },
  { label: 'List All', cmd: 'docker ps -a' },
  { label: 'Run Nginx (8080:80)', cmd: 'docker run -d -p 8080:80 --name web-server nginx:alpine' },
  { label: 'Test Web Server', cmd: 'curl http://localhost:8080' },
  { label: 'Run Redis', cmd: 'docker run -d --name redis-cache redis:alpine' },
  { label: 'Create Network', cmd: 'docker network create app-net' },
  { label: 'Compose Up', cmd: 'docker compose up -d' },
  { label: 'Inspect Logs', cmd: 'docker logs web-server' },
];

export default function Terminal({
  terminalLines,
  onExecuteCommand,
  onNavigateHistory,
  onClear,
}) {
  const [inputVal, setInputVal] = useState('');
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new terminal line
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
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
        // Auto-complete suggestions
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
    <View style={styles.terminalContainer}>
      {/* Terminal Title Bar */}
      <View style={styles.titleBar}>
        <View style={styles.macButtons}>
          <View style={[styles.dot, styles.dotRed]} />
          <View style={[styles.dot, styles.dotYellow]} />
          <View style={[styles.dot, styles.dotGreen]} />
        </View>

        <View style={styles.termTitleRow}>
          <TermIcon size={13} color="#58a6ff" />
          <Text style={styles.termTitleText}>root@docker-sandbox: ~ (bash 5.2)</Text>
        </View>

        <View style={styles.termActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onExecuteCommand('help')}
            title="Help"
          >
            <HelpCircle size={13} color="#8b949e" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onExecuteCommand('clear')}
            title="Clear"
          >
            <Trash2 size={13} color="#8b949e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Terminal Output Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.outputScroll}
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
      <View style={styles.inputArea}>
        <View style={styles.inputPrompt}>
          <Text style={styles.promptSymbolGreen}>➜</Text>
          <Text style={styles.promptPath}>docker</Text>
        </View>

        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={handleSubmit}
          onKeyPress={handleKeyDown}
          placeholder="Type docker command (e.g. docker ps, docker run...)"
          placeholderTextColor="#484f58"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />

        <TouchableOpacity
          style={styles.runButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Play size={13} color="#ffffff" />
          <Text style={styles.runButtonText}>Run</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Interactive Command Chips */}
      <View style={styles.quickCommandsBar}>
        <View style={styles.quickHeader}>
          <Sparkles size={11} color="#58a6ff" />
          <Text style={styles.quickHeaderText}>Quick Commands:</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickChipsScroll}
        >
          {COMMON_COMMANDS.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chip}
              onPress={() => onExecuteCommand(item.cmd)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipLabel}>{item.label}</Text>
              <Text style={styles.chipCmd}>{item.cmd}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  terminalContainer: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 380,
  },
  titleBar: {
    height: 36,
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  macButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotRed: { backgroundColor: '#ff5f56' },
  dotYellow: { backgroundColor: '#ffbd2e' },
  dotGreen: { backgroundColor: '#27c93f' },
  termTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  termTitleText: {
    color: '#8b949e',
    fontSize: 11,
    fontFamily: 'Fira Code, monospace',
    fontWeight: '600',
  },
  termActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#21262d',
  },
  outputScroll: {
    flex: 1,
    backgroundColor: '#090d12',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  outputContent: {
    paddingBottom: 16,
  },
  lineBase: {
    fontFamily: 'Fira Code, monospace',
    fontSize: 12.5,
    lineHeight: 19,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  inputEchoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 2,
  },
  promptUser: {
    color: '#3fb950',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12.5,
    fontWeight: '700',
  },
  promptColon: {
    color: '#8b949e',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12.5,
  },
  promptDir: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12.5,
    fontWeight: '600',
  },
  promptSymbol: {
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12.5,
    marginRight: 6,
  },
  cmdEchoText: {
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12.5,
    fontWeight: '600',
  },
  outputDefault: {
    color: '#c9d1d9',
  },
  outputInfo: {
    color: '#58a6ff',
    fontWeight: '600',
  },
  outputSuccess: {
    color: '#3fb950',
    fontWeight: '600',
  },
  outputError: {
    color: '#f85149',
    fontWeight: '500',
  },
  outputHint: {
    color: '#e3b341',
    backgroundColor: 'rgba(227, 179, 65, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 3,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderTopWidth: 1,
    borderTopColor: '#30363d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  inputPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promptSymbolGreen: {
    color: '#3fb950',
    fontFamily: 'Fira Code, monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  promptPath: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 13,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#0d1117',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#30363d',
    outlineStyle: 'none',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#238636',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  runButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  quickCommandsBar: {
    backgroundColor: '#0d1117',
    borderTopWidth: 1,
    borderTopColor: '#21262d',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  quickHeaderText: {
    color: '#8b949e',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  quickChipsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'column',
  },
  chipLabel: {
    fontSize: 10,
    color: '#58a6ff',
    fontWeight: '700',
  },
  chipCmd: {
    fontSize: 10,
    color: '#8b949e',
    fontFamily: 'Fira Code, monospace',
  },
});
