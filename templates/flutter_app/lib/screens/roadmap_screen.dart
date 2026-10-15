import 'package:flutter/material.dart';
import '../models/duolingo_models.dart';
import 'lesson_screen.dart';

class RoadmapScreen extends StatefulWidget {
  final List<CourseUnit> course;
  final int streak;
  final int gems;
  final int hearts;
  final int dailyXp;
  final Function(int) onUpdateHearts;

  const RoadmapScreen({
    Key? key,
    required this.course,
    required this.streak,
    required this.gems,
    required this.hearts,
    required this.dailyXp,
    required this.onUpdateHearts,
  }) : super(key: key);

  @override
  State<RoadmapScreen> createState() => _RoadmapScreenState();
}

class _RoadmapScreenState extends State<RoadmapScreen> {
  final List<double> _xOffsets = [0, 48, 72, 48, 0, -48, -72, -48];

  @override
  Widget build(BuildContext context) {
    if (widget.course.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    final firstUnit = widget.course.first;

    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFB),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Header
            _buildTopHeader(),

            // 2. Daily Goal Bar
            _buildDailyGoalBar(),

            // 3. Scrollable Snake Roadmap
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
                child: Column(
                  children: [
                    // Unit Banner
                    _buildUnitBanner(firstUnit),
                    const SizedBox(height: 24),

                    // Snake Stage Nodes
                    ...List.generate(widget.course.length.clamp(0, 20), (index) {
                      final unit = widget.course[index];
                      final offset = _xOffsets[index % _xOffsets.length];
                      return _buildStageNode(unit, offset, index);
                    }),
                    const SizedBox(height: 60),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopHeader() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 18),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE5E5E5), width: 2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            '🇰🇷 TOPIK-DUO',
            style: TextStyle(fontWeight: FontWeight.w900, fontSize: 17, color: Color(0xFF58A700)),
          ),
          Row(
            children: [
              _buildStatItem('🔥', '${widget.streak}', const Color(0xFFFF9600)),
              const SizedBox(width: 14),
              _buildStatItem('💎', '${widget.gems}', const Color(0xFF1CB0F6)),
              const SizedBox(width: 14),
              _buildStatItem('❤️', '${widget.hearts}', const Color(0xFFFF4B4B)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String icon, String val, Color color) {
    return Row(
      children: [
        Text(icon, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 4),
        Text(val, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: color)),
      ],
    );
  }

  Widget _buildDailyGoalBar() {
    final double pct = (widget.dailyXp / 50.0).clamp(0.0, 1.0);
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
      child: Row(
        children: [
          Text(
            '일일 목표: ${widget.dailyXp} / 50 XP',
            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFF4B4B4B)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: pct,
                backgroundColor: const Color(0xFFE5E5E5),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFFC800)),
                minHeight: 10,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUnitBanner(CourseUnit unit) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF58CC02),
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: Color(0xFF58A700), offset: Offset(0, 4), blurRadius: 0),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            unit.title,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18),
          ),
          const SizedBox(height: 4),
          Text(
            '${unit.titleEng} • ${unit.category}',
            style: TextStyle(color: Colors.white.withOpacity(0.95), fontWeight: FontWeight.w700, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildStageNode(CourseUnit unit, double offset, int index) {
    final bool isCompleted = unit.status == 'completed';
    final bool isUnlocked = unit.status == 'unlocked' || isCompleted;

    Color bgColor = const Color(0xFF58CC02);
    Color shadowColor = const Color(0xFF58A700);

    if (isCompleted) {
      bgColor = const Color(0xFFFFC800);
      shadowColor = const Color(0xFFE5A500);
    } else if (!isUnlocked) {
      bgColor = const Color(0xFFD0D0D0);
      shadowColor = const Color(0xFFAFAFAF);
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Transform.translate(
        offset: Offset(offset, 0),
        child: Column(
          children: [
            GestureDetector(
              onTap: isUnlocked
                  ? () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => LessonScreen(unit: unit),
                        ),
                      );
                    }
                  : null,
              child: Container(
                width: 74,
                height: 68,
                decoration: BoxDecoration(
                  color: bgColor,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: shadowColor, offset: const Offset(0, 8), blurRadius: 0),
                  ],
                ),
                alignment: Alignment.center,
                child: Text(
                  isCompleted ? '✓' : (isUnlocked ? '★' : '🔒'),
                  style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900),
                ),
              ),
            ),
            if (isCompleted && unit.stars > 0)
              Padding(
                padding: const EdgeInsets.only(top: 10.0),
                child: Text(
                  '★' * unit.stars + '☆' * (3 - unit.stars),
                  style: const TextStyle(color: Color(0xFFFFC800), fontSize: 13, letterSpacing: 2),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
