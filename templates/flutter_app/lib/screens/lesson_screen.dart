import 'package:flutter/material.dart';
import '../models/duolingo_models.dart';
import '../widgets/duo_button.dart';

class LessonScreen extends StatefulWidget {
  final CourseUnit unit;

  const LessonScreen({Key? key, required this.unit}) : super(key: key);

  @override
  State<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen> {
  int _challengeIndex = 0;
  int _hearts = 5;
  int _wrongCount = 0;
  int _comboCount = 0;
  bool _isChecked = false;
  bool _isCorrect = false;
  String _explanation = '';
  
  // Challenge inputs
  List<String> _selectedTokens = [];
  int? _selectedChoiceIndex;
  List<PairItem> _matchedPairs = [];
  PairItem? _firstSelectedPair;

  @override
  Widget build(BuildContext context) {
    final challenges = widget.unit.challenges;
    if (challenges.isEmpty) {
      return Scaffold(
        body: Center(
          child: Text('해당 단원에 챌린지가 없습니다.', style: TextStyle(fontSize: 16)),
        ),
      );
    }

    final currentChallenge = challenges[_challengeIndex];
    final double progress = (_challengeIndex / challenges.length).clamp(0.0, 1.0);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // 1. Top Bar
                _buildTopBar(progress),

                // 2. Combo Badge
                if (_comboCount >= 2) _buildComboBadge(),

                // 3. Challenge Content
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentChallenge.prompt,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF3C3C3C),
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 24),
                        _buildChallengeBody(currentChallenge),
                      ],
                    ),
                  ),
                ),

                // 4. Bottom Drawer Spacing
                const SizedBox(height: 110),
              ],
            ),

            // 5. Bottom Feedback Drawer
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: _buildBottomDrawer(currentChallenge),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar(double progress) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.close, color: Color(0xFFAFAFAF), size: 28),
            onPressed: () => Navigator.pop(context),
          ),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: const Color(0xFFE5E5E5),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF58CC02)),
                minHeight: 14,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Row(
            children: [
              const Text('❤️', style: TextStyle(fontSize: 18)),
              const SizedBox(width: 4),
              Text(
                '$_hearts',
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17, color: Color(0xFFFF4B4B)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildComboBadge() {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFFFF9600), Color(0xFFFF4B4B)]),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: const Color(0xFFFF4B4B).withOpacity(0.35), blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: Text(
        '🔥 $_comboCount COMBO! 연속 정답',
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13),
      ),
    );
  }

  Widget _buildChallengeBody(Challenge challenge) {
    switch (challenge.type) {
      case 'translate_tokens':
        return _buildTranslateTokensBody(challenge);
      case 'listen_comprehension':
      case 'multiple_choice':
        return _buildChoiceBody(challenge);
      default:
        return _buildChoiceBody(challenge);
    }
  }

  Widget _buildTranslateTokensBody(Challenge challenge) {
    return Column(
      children: [
        // Answer Drop Zone
        Container(
          minHeight: 64,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: Color(0xFFD0D0D0), width: 2)),
          ),
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _selectedTokens.map((token) {
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedTokens.remove(token);
                  });
                },
                child: _buildTokenChip(token, isSelected: true),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 36),

        // Word Bank
        Wrap(
          spacing: 10,
          runSpacing: 10,
          alignment: WrapAlignment.center,
          children: challenge.tokens.map((token) {
            final bool isUsed = _selectedTokens.contains(token);
            return GestureDetector(
              onTap: isUsed
                  ? null
                  : () {
                      setState(() {
                        _selectedTokens.add(token);
                      });
                    },
              child: _buildTokenChip(token, isPlaceholder: isUsed),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildTokenChip(String text, {bool isSelected = false, bool isPlaceholder = false}) {
    if (isPlaceholder) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFFE5E5E5),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(text, style: const TextStyle(color: Colors.transparent, fontSize: 16)),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E5E5), width: 2),
        boxShadow: const [
          BoxShadow(color: Color(0xFFD0D0D0), offset: Offset(0, 3), blurRadius: 0),
        ],
      ),
      child: Text(
        text,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF3C3C3C)),
      ),
    );
  }

  Widget _buildChoiceBody(Challenge challenge) {
    return Column(
      children: [
        if (challenge.spokenText != null) ...[
          GestureDetector(
            onTap: () {
              // TTS trigger
            },
            child: Container(
              width: 68,
              height: 68,
              decoration: BoxDecoration(
                color: const Color(0xFF1CB0F6),
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(color: Color(0xFF1899D6), offset: Offset(0, 5), blurRadius: 0),
                ],
              ),
              alignment: Alignment.center,
              child: const Text('🔊', style: TextStyle(fontSize: 28)),
            ),
          ),
          const SizedBox(height: 24),
        ],
        ...List.generate(challenge.options.length, (idx) {
          final opt = challenge.options[idx];
          final bool isChosen = _selectedChoiceIndex == idx;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedChoiceIndex = idx;
                });
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                decoration: BoxDecoration(
                  color: isChosen ? const Color(0xFFE7F7FF) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isChosen ? const Color(0xFF1CB0F6) : const Color(0xFFE5E5E5),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: isChosen ? const Color(0xFF1CB0F6) : const Color(0xFFD0D0D0),
                      offset: const Offset(0, 4),
                      blurRadius: 0,
                    ),
                  ],
                ),
                child: Text(
                  opt,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: isChosen ? const Color(0xFF1899D6) : const Color(0xFF3C3C3C),
                  ),
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildBottomDrawer(Challenge challenge) {
    Color drawerBg = Colors.white;
    BorderSide borderSide = const BorderSide(color: Color(0xFFE5E5E5), width: 2);

    if (_isChecked) {
      drawerBg = _isCorrect ? const Color(0xFFD7FFB8) : const Color(0xFFFFDFE0);
      borderSide = BorderSide.none;
    }

    final bool canCheck = (_selectedTokens.isNotEmpty || _selectedChoiceIndex != null) && !_isChecked;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      decoration: BoxDecoration(
        color: drawerBg,
        border: Border(top: borderSide),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_isChecked) ...[
            Row(
              children: [
                Text(
                  _isCorrect ? '✓' : '✕',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: _isCorrect ? const Color(0xFF58A700) : const Color(0xFFEA2B2B),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  _isCorrect ? '정답입니다!' : '오답입니다',
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.w900,
                    color: _isCorrect ? const Color(0xFF58A700) : const Color(0xFFEA2B2B),
                  ),
                ),
              ],
            ),
            if (!_isCorrect && _explanation.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                _explanation,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFFEA2B2B)),
              ),
            ],
            const SizedBox(height: 14),
          ],
          Duo3DButton(
            text: _isChecked ? '계속하기' : '확인',
            backgroundColor: _isChecked
                ? (_isCorrect ? const Color(0xFF58CC02) : const Color(0xFFFF4B4B))
                : const Color(0xFF58CC02),
            shadowColor: _isChecked
                ? (_isCorrect ? const Color(0xFF58A700) : const Color(0xFFEA2B2B))
                : const Color(0xFF58A700),
            onPressed: (_isChecked || canCheck) ? _onActionPressed : null,
          ),
        ],
      ),
    );
  }

  void _onActionPressed() {
    final challenges = widget.unit.challenges;
    final challenge = challenges[_challengeIndex];

    if (!_isChecked) {
      bool isAnsCorrect = false;
      String exp = '';

      if (challenge.type == 'translate_tokens') {
        final assembled = _selectedTokens.join(' ').trim();
        final target = (challenge.targetText ?? '').trim();
        isAnsCorrect = (assembled == target);
        exp = '정답: ${challenge.targetText}';
      } else if (challenge.type == 'multiple_choice' || challenge.type == 'listen_comprehension') {
        isAnsCorrect = (_selectedChoiceIndex == challenge.correctIndex);
        if (challenge.options.isNotEmpty && challenge.correctIndex < challenge.options.length) {
          exp = '정답: ${challenge.options[challenge.correctIndex]}';
        }
      }

      setState(() {
        _isChecked = true;
        _isCorrect = isAnsCorrect;
        _explanation = exp;

        if (isAnsCorrect) {
          _comboCount++;
        } else {
          _comboCount = 0;
          _wrongCount++;
          _hearts = (_hearts - 1).clamp(0, 5);
        }
      });

      if (_hearts == 0) {
        _showHeartPaywall();
      }
    } else {
      // Move to next challenge or finish
      if (_challengeIndex + 1 < challenges.length) {
        setState(() {
          _challengeIndex++;
          _isChecked = false;
          _isCorrect = false;
          _selectedTokens.clear();
          _selectedChoiceIndex = null;
        });
      } else {
        _finishLesson();
      }
    }
  }

  void _showHeartPaywall() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('💔 하트가 모두 소진되었어요!', style: TextStyle(fontWeight: FontWeight.w900)),
        content: const Text('실수를 복구하려면 하트가 필요합니다.\n광고를 시청하고 하트 5개를 무료로 충전하세요!'),
        actions: [
          Duo3DButton(
            text: '🎬 무료 광고 시청 (+5 ❤️)',
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                _hearts = 5;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('🎉 보상형 광고 시청 완료! 하트 5개가 충전되었습니다.')),
              );
            },
          ),
        ],
      ),
    );
  }

  void _finishLesson() {
    widget.unit.status = 'completed';
    final accuracy = (((widget.unit.challenges.length - _wrongCount) / widget.unit.challenges.length) * 100).round();
    widget.unit.stars = accuracy == 100 ? 3 : (accuracy >= 80 ? 2 : 1);

    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('🦉🎉', style: TextStyle(fontSize: 64)),
            const SizedBox(height: 12),
            const Text('단원 마스터!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text('★' * widget.unit.stars + '☆' * (3 - widget.unit.stars),
                style: const TextStyle(color: Color(0xFFFFC800), fontSize: 28, letterSpacing: 4)),
            const SizedBox(height: 24),
            Duo3DButton(
              text: '계속하기',
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
