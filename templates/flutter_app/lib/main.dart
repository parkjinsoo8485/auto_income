import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models/duolingo_models.dart';
import 'screens/roadmap_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DuolingoKoreanApp());
}

class DuolingoKoreanApp extends StatelessWidget {
  const DuolingoKoreanApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Korean Master Duolingo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primaryColor: const Color(0xFF58CC02),
        scaffoldBackgroundColor: const Color(0xFFFBFBFB),
        fontFamily: 'Nunito',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF58CC02),
          primary: const Color(0xFF58CC02),
          secondary: const Color(0xFF1CB0F6),
        ),
      ),
      home: const MainHomeNavigation(),
    );
  }
}

class MainHomeNavigation extends StatefulWidget {
  const MainHomeNavigation({Key? key}) : super(key: key);

  @override
  State<MainHomeNavigation> createState() => _MainHomeNavigationState();
}

class _MainHomeNavigationState extends State<MainHomeNavigation> {
  int _currentIndex = 0;
  List<CourseUnit> _course = [];
  int _streak = 7;
  int _gems = 500;
  int _hearts = 5;
  int _dailyXp = 25;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCourseData();
  }

  Future<void> _loadCourseData() async {
    try {
      final String jsonStr = await rootBundle.loadString('assets/data/duolingo_course.json');
      final List<dynamic> list = jsonDecode(jsonStr);
      final units = list.map((u) => CourseUnit.fromJson(u)).toList();
      if (units.isNotEmpty) {
        units.first.status = 'unlocked';
      }
      setState(() {
        _course = units;
        _isLoading = false;
      });
    } catch (e) {
      // Fallback sample units if asset not yet bundled
      setState(() {
        _course = [
          CourseUnit(
            unitId: 1,
            title: '단원 1: 한글 익히기 I',
            titleEng: 'Hangul Alphabet I (Basic Consonants & Vowels)',
            category: '한글 기초',
            categoryColor: '#58CC02',
            xpReward: 15,
            status: 'unlocked',
            challenges: [
              Challenge(
                id: 'u1_c1_tokens',
                type: 'translate_tokens',
                prompt: '다음 문장을 단어 카드를 순서대로 눌러 완성하세요',
                targetText: '아침에 우유를 마셔요.',
                tokens: ['아침에', '우유를', '마셔요.', '사과를', '친구'],
                correctSequence: ['아침에', '우유를', '마셔요.'],
              ),
              Challenge(
                id: 'u1_c2_mcq',
                type: 'multiple_choice',
                prompt: '다음 뜻에 해당하는 한국어 단어는 무엇일까요?\n👉 "Milk"',
                options: ['우유', '오이', '아이', '모자'],
                correctIndex: 0,
              ),
            ],
          ),
        ];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF58CC02))),
      );
    }

    final pages = [
      RoadmapScreen(
        course: _course,
        streak: _streak,
        gems: _gems,
        hearts: _hearts,
        dailyXp: _dailyXp,
        onUpdateHearts: (h) => setState(() => _hearts = h),
      ),
      const Center(child: Text('🏆 순위표 (리그전 준비 중)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
      const Center(child: Text('👤 내 프로필 & 학습 통계', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
      const Center(child: Text('🛒 상점 (하트 충전 & 부스터)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
    ];

    return Scaffold(
      body: pages[_currentIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFE5E5E5), width: 2)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (idx) => setState(() => _currentIndex = idx),
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF58CC02),
          unselectedItemColor: const Color(0xFFAFAFAF),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.school), label: '학습'),
            BottomNavigationBarItem(icon: Icon(Icons.leaderboard), label: '리그'),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
            BottomNavigationBarItem(icon: Icon(Icons.store), label: '상점'),
          ],
        ),
      ),
    );
  }
}
