import 'dart:convert';

class CourseUnit {
  final int unitId;
  final String title;
  final String titleEng;
  final String category;
  final String categoryColor;
  final int xpReward;
  final List<Challenge> challenges;
  String status; // unlocked, completed, locked
  int stars; // 0, 1, 2, 3

  CourseUnit({
    required this.unitId,
    required this.title,
    required this.titleEng,
    required this.category,
    required this.categoryColor,
    required this.xpReward,
    required this.challenges,
    this.status = 'locked',
    this.stars = 0,
  });

  factory CourseUnit.fromJson(Map<String, dynamic> json) {
    return CourseUnit(
      unitId: json['unitId'] ?? 1,
      title: json['title'] ?? '',
      titleEng: json['titleEng'] ?? '',
      category: json['category'] ?? '',
      categoryColor: json['categoryColor'] ?? '#58CC02',
      xpReward: json['xpReward'] ?? 15,
      status: json['status'] ?? 'locked',
      stars: json['stars'] ?? 0,
      challenges: (json['challenges'] as List? ?? [])
          .map((c) => Challenge.fromJson(c))
          .toList(),
    );
  }
}

class Challenge {
  final String id;
  final String type; // translate_tokens, match_pairs, listen_comprehension, character_trace, multiple_choice
  final String prompt;
  final String? targetText;
  final String? spokenText;
  final String? character;
  final String? word;
  final String? meaning;
  final List<String> tokens;
  final List<String> correctSequence;
  final List<PairItem> pairs;
  final List<String> options;
  final int correctIndex;

  Challenge({
    required this.id,
    required this.type,
    required this.prompt,
    this.targetText,
    this.spokenText,
    this.character,
    this.word,
    this.meaning,
    this.tokens = const [],
    this.correctSequence = const [],
    this.pairs = const [],
    this.options = const [],
    this.correctIndex = 0,
  });

  factory Challenge.fromJson(Map<String, dynamic> json) {
    List<PairItem> pairList = [];
    if (json['pairs'] != null) {
      for (var p in json['pairs']) {
        pairList.add(PairItem(korean: p['korean'] ?? '', meaning: p['meaning'] ?? ''));
      }
    }

    return Challenge(
      id: json['id'] ?? '',
      type: json['type'] ?? 'multiple_choice',
      prompt: json['prompt'] ?? '',
      targetText: json['targetText'],
      spokenText: json['spokenText'],
      character: json['character'],
      word: json['word'],
      meaning: json['meaning'],
      tokens: List<String>.from(json['tokens'] ?? []),
      correctSequence: List<String>.from(json['correctSequence'] ?? []),
      pairs: pairList,
      options: List<String>.from(json['options'] ?? []),
      correctIndex: json['correctIndex'] ?? 0,
    );
  }
}

class PairItem {
  final String korean;
  final String meaning;
  PairItem({required this.korean, required this.meaning});
}
