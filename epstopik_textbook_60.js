/* ═══════════════════════════════════════════════════════════════
   한국산업인력공단(HRD-Korea) EPS-TOPIK 한국어 표준교재 1·2권 (총 60과)
   60 Comprehensive Lessons Curriculum Database for EPS TOPIK Exam Prep
   ═══════════════════════════════════════════════════════════════ */

const EPSTOPIK_TEXTBOOK_60 = [
  {
    "id": 1,
    "book": 1,
    "lessonNum": 1,
    "title": "한글 익히기 I",
    "titleEng": "Hangul Alphabet I (Basic Consonants & Vowels)",
    "category": "한글 기초",
    "categoryColor": "#3b82f6",
    "goal": "한글의 기본 자음(14개)과 단모음(10개)의 소리와 모양을 익히고 결합하여 음절을 읽을 수 있다.",
    "grammar": [
      {
        "name": "기본 모음 (아, 야, 어, 여, 오, 요, 우, 유, 으, 이)",
        "summary": "단모음 발음 원리",
        "details": "하늘(ㆍ), 땅(ㅡ), 사람(ㅣ)을 본떠 만든 기본 모음의 음가와 입모양 결합 원리입니다.",
        "examples": [
          "아이 (child)",
          "오이 (cucumber)",
          "우유 (milk)"
        ]
      },
      {
        "name": "기본 자음 (ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ)",
        "summary": "기본 자음의 발음 기관 상형",
        "details": "발음 기관의 모양을 본떠 만든 닿소리(자음)의 음가와 모음과의 초성 결합 원리입니다.",
        "examples": [
          "가구 (furniture)",
          "나비 (butterfly)",
          "다리 (bridge/leg)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "아이",
        "meaning": "Child",
        "pron": "a-i",
        "example": "아이가 귀여워요."
      },
      {
        "word": "오이",
        "meaning": "Cucumber",
        "pron": "o-i",
        "example": "시장에서 오이를 사요."
      },
      {
        "word": "우유",
        "meaning": "Milk",
        "pron": "u-yu",
        "example": "아침에 우유를 마셔요."
      },
      {
        "word": "모자",
        "meaning": "Hat / Cap",
        "pron": "mo-ja",
        "example": "예쁜 모자를 씁니다."
      },
      {
        "word": "바지",
        "meaning": "Pants / Trousers",
        "pron": "ba-ji",
        "example": "작업복 바지를 입어요."
      },
      {
        "word": "치마",
        "meaning": "Skirt",
        "pron": "chi-ma",
        "example": "치마를 입었습니다."
      },
      {
        "word": "사과",
        "meaning": "Apple",
        "pron": "sa-gwa",
        "example": "빨간 사과가 맛있어요."
      },
      {
        "word": "포도",
        "meaning": "Grape",
        "pron": "po-do",
        "example": "달콤한 포도를 먹어요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 모음 발음 연습",
        "lines": [
          {
            "speaker": "선생님",
            "role": "교사",
            "text": "따라 읽으세요. 아, 야, 어, 여.",
            "trans": "Please repeat after me. A, Ya, Eo, Yeo."
          },
          {
            "speaker": "학생들",
            "role": "수험생",
            "text": "아, 야, 어, 여!",
            "trans": "A, Ya, Eo, Yeo!"
          }
        ]
      },
      {
        "title": "대화 2: 낱말 만들기",
        "lines": [
          {
            "speaker": "선생님",
            "role": "교사",
            "text": "이 그림은 무엇일까요? '오'와 '이'가 만나면?",
            "trans": "What is this picture? When 'O' and 'I' meet?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "'오이'입니다, 선생님!",
            "trans": "It is 'Oi' (cucumber), teacher!"
          }
        ]
      }
    ],
    "culture": "세종대왕의 훈민정음 창제 정신: 한글은 과학적이고 배우기 쉬운 세계 유일의 발명 문자입니다.",
    "quiz": [
      {
        "q": "다음 중 '아이'를 올바르게 표기한 것은?",
        "options": [
          "오이",
          "아이",
          "우유",
          "여우"
        ],
        "ans": 2,
        "exp": "'아이'는 child를 뜻하는 기본 단어입니다."
      },
      {
        "q": "'ㄱ'에 모음 'ㅏ'가 결합한 글자는 무엇입니까?",
        "options": [
          "고",
          "구",
          "가",
          "기"
        ],
        "ans": 3,
        "exp": "초성 ㄱ + 중성 ㅏ = 가."
      },
      {
        "q": "그림의 [우유]를 읽은 것으로 알맞은 것은?",
        "options": [
          "우유",
          "오이",
          "모자",
          "사자"
        ],
        "ans": 1,
        "exp": "Milk는 '우유'입니다."
      },
      {
        "q": "다음 중 기본 모음이 아닌 것은?",
        "options": [
          "ㅏ",
          "ㅓ",
          "ㅘ",
          "ㅗ"
        ],
        "ans": 3,
        "exp": "'ㅘ'는 이중모음(복합모음)입니다."
      }
    ]
  },
  {
    "id": 2,
    "book": 1,
    "lessonNum": 2,
    "title": "한글 익히기 II",
    "titleEng": "Hangul Alphabet II (Batchim & Double Consonants)",
    "category": "한글 기초",
    "categoryColor": "#3b82f6",
    "goal": "받침(종성 7대표음)과 된소리(쌍자음), 이중모음을 이해하고 정확하게 발음할 수 있다.",
    "grammar": [
      {
        "name": "쌍자음 (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)",
        "summary": "된소리 발음",
        "details": "목구멍 근육을 긴장시켜 내는 강한 소리로 예사소리(ㄱ,ㄷ,ㅂ,ㅅ,ㅈ)와 구별됩니다.",
        "examples": [
          "까치 (magpie)",
          "따뜻하다 (warm)",
          "뿌리 (root)"
        ]
      },
      {
        "name": "받침의 7대표음 (ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ)",
        "summary": "종성 발음 규칙",
        "details": "모든 종성 자음은 음절 끝에서 7가지 대표음 중 하나로 소리 납니다.",
        "examples": [
          "옷 [옫]",
          "꽃 [꼳]",
          "부엌 [부억]"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "책",
        "meaning": "Book",
        "pron": "chaek",
        "example": "한국어 책을 읽어요."
      },
      {
        "word": "공책",
        "meaning": "Notebook",
        "pron": "gong-chaek",
        "example": "공책에 필기합니다."
      },
      {
        "word": "가방",
        "meaning": "Bag",
        "pron": "ga-bang",
        "example": "가방에 지갑을 넣어요."
      },
      {
        "word": "창문",
        "meaning": "Window",
        "pron": "chang-mun",
        "example": "더워서 창문을 열어요."
      },
      {
        "word": "출입문",
        "meaning": "Entrance Door",
        "pron": "chul-ip-mun",
        "example": "출입문을 닫아 주세요."
      },
      {
        "word": "안경",
        "meaning": "Glasses",
        "pron": "an-gyeong",
        "example": "안경을 쓰고 글씨를 봐요."
      },
      {
        "word": "시계",
        "meaning": "Clock / Watch",
        "pron": "si-gye",
        "example": "벽시계를 봅니다."
      },
      {
        "word": "볼펜",
        "meaning": "Ballpoint Pen",
        "pron": "bol-pen",
        "example": "볼펜으로 이름을 써요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 받침 소리 익히기",
        "lines": [
          {
            "speaker": "선생님",
            "role": "교사",
            "text": "'꽃'의 받침은 ㅊ이지만, 소리는 [ㄷ]으로 납니다.",
            "trans": "The final consonant of '꽃' is ㅊ, but the sound is [ㄷ]."
          },
          {
            "speaker": "수루",
            "role": "외국인 근로자",
            "text": "아, 그래서 [꼳]이라고 발음하는군요!",
            "trans": "Ah, so it is pronounced as [kkot]!"
          }
        ]
      },
      {
        "title": "대화 2: 교실 물건 확인",
        "lines": [
          {
            "speaker": "리한",
            "role": "외국인 근로자",
            "text": "이것은 무엇입니까?",
            "trans": "What is this?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "한국어 공부하는 '책'입니다.",
            "trans": "It is the 'book' for studying Korean."
          }
        ]
      }
    ],
    "culture": "받침 연음 법칙: 받침 뒤에 모음으로 시작하는 음절이 오면 받침이 다음 첫소리로 넘어가 소리 납니다. 예: 한국어 [한구거].",
    "quiz": [
      {
        "q": "'꽃'의 올바른 발음은 무엇입니까?",
        "options": [
          "[꼳]",
          "[꼿]",
          "[꽂]",
          "[꾯]"
        ],
        "ans": 1,
        "exp": "종성 ㅊ은 7대표음 중 [ㄷ]으로 발음됩니다."
      },
      {
        "q": "다음 중 쌍자음(된소리)이 들어간 단어는?",
        "options": [
          "가방",
          "책상",
          "창문",
          "시계"
        ],
        "ans": 2,
        "exp": "'책상'의 '상'은 된소리가 아니지만 '까치', '토끼' 등에 쌍자음이 쓰입니다."
      },
      {
        "q": "그림의 '가방'에 들어 있는 받침(종성)은?",
        "options": [
          "ㄴ",
          "ㅇ",
          "ㅁ",
          "ㄹ"
        ],
        "ans": 2,
        "exp": "'가방'의 종성은 'ㅇ'입니다."
      },
      {
        "q": "'한국어'를 읽을 때 실제 발음은?",
        "options": [
          "[한국어]",
          "[한구거]",
          "[항국어]",
          "[한구어]"
        ],
        "ans": 2,
        "exp": "받침 ㄱ이 모음 ㅓ로 연음되어 [한구거]가 됩니다."
      }
    ]
  },
  {
    "id": 3,
    "book": 1,
    "lessonNum": 3,
    "title": "교실 한국어",
    "titleEng": "Classroom Korean",
    "category": "기초 회화",
    "categoryColor": "#10b981",
    "goal": "수업 시간에 자주 사용하는 기본 지시어와 인사말을 듣고 이해하여 행동할 수 있다.",
    "grammar": [
      {
        "name": "-(으)세요 (명령 및 정중한 권유)",
        "summary": "정중한 행동 지시",
        "details": "받침이 없으면 -세요, 받침이 있으면 -으세요를 붙여 듣는 이에게 행동을 권유합니다.",
        "examples": [
          "책을 펴세요. (Open your book.)",
          "따라 하세요. (Repeat after me.)",
          "앉으세요. (Please sit down.)"
        ]
      },
      {
        "name": "-지 마세요 (금지 표현)",
        "summary": "행동 금지 요청",
        "details": "동사 어간 뒤에 붙어 상대방에게 어떤 행동을 하지 말 것을 요청합니다.",
        "examples": [
          "떠들지 마세요. (Do not make noise.)",
          "만지지 마세요. (Do not touch.)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "선생님",
        "meaning": "Teacher",
        "pron": "seon-saeng-nim",
        "example": "선생님이 수업을 시작해요."
      },
      {
        "word": "학생",
        "meaning": "Student",
        "pron": "hak-saeng",
        "example": "교실에 학생이 많아요."
      },
      {
        "word": "반 친구",
        "meaning": "Classmate",
        "pron": "ban chin-gu",
        "example": "반 친구와 인사해요."
      },
      {
        "word": "칠판",
        "meaning": "Blackboard / Whiteboard",
        "pron": "chil-pan",
        "example": "칠판을 보세요."
      },
      {
        "word": "책을 펴다",
        "meaning": "To open the book",
        "pron": "chae-geul pyeo-da",
        "example": "교재 10쪽을 펴세요."
      },
      {
        "word": "책을 덮다",
        "meaning": "To close the book",
        "pron": "chae-geul deop-da",
        "example": "책을 덮고 시험을 봅니다."
      },
      {
        "word": "듣다",
        "meaning": "To listen / hear",
        "pron": "deut-da",
        "example": "선생님 말씀을 잘 들으세요."
      },
      {
        "word": "질문하다",
        "meaning": "To ask a question",
        "pron": "jil-mun-ha-da",
        "example": "모르면 질문하세요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 수업 시작 지시",
        "lines": [
          {
            "speaker": "선생님",
            "role": "교사",
            "text": "여러분, 책을 펴세요. 칠판을 보세요.",
            "trans": "Everyone, please open your books. Look at the board."
          },
          {
            "speaker": "학생들",
            "role": "학생들",
            "text": "네, 선생님!",
            "trans": "Yes, teacher!"
          }
        ]
      },
      {
        "title": "대화 2: 이해 여부 확인",
        "lines": [
          {
            "speaker": "선생님",
            "role": "교사",
            "text": "알겠어요? 질문 있어요?",
            "trans": "Do you understand? Do you have any questions?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 알겠습니다. 질문 없습니다.",
            "trans": "Yes, I understand. I have no questions."
          }
        ]
      }
    ],
    "culture": "한국의 교실 예절: 수업 시작과 끝에 반장이 '차렷, 경례'를 외치며 선생님께 고개 숙여 인사하는 문화가 있습니다.",
    "quiz": [
      {
        "q": "선생님이 '칠판을 보세요'라고 했을 때 행동으로 알맞은 것은?",
        "options": [
          "책을 덮는다",
          "칠판을 바라본다",
          "공책에 쓴다",
          "밖으로 나간다"
        ],
        "ans": 2,
        "exp": "'보다'의 정중형 '보세요'는 칠판을 바라보라는 지시입니다."
      },
      {
        "q": "'이해했습니까?'라는 교사의 질문에 알맞은 대답은?",
        "options": [
          "네, 알겠습니다.",
          "아니요, 반갑습니다.",
          "네, 안녕하세요.",
          "감사합니다."
        ],
        "ans": 1,
        "exp": "이해했을 때는 '네, 알겠습니다'라고 대답합니다."
      },
      {
        "q": "'책을 펴세요'의 반대 의미를 가진 표현은?",
        "options": [
          "책을 읽으세요",
          "책을 덮으세요",
          "책을 사세요",
          "책을 쓰세요"
        ],
        "ans": 2,
        "exp": "'펴다'의 반대말은 '덮다'입니다."
      },
      {
        "q": "상대방의 말을 귀 기울여 들으라는 지시어는?",
        "options": [
          "쓰세요",
          "들으세요",
          "말하세요",
          "쉬세요"
        ],
        "ans": 2,
        "exp": "'듣다' + (으)세요 = 들으세요."
      }
    ]
  },
  {
    "id": 4,
    "book": 1,
    "lessonNum": 4,
    "title": "안녕하세요",
    "titleEng": "Hello (Greetings & Basic Manners)",
    "category": "기초 회화",
    "categoryColor": "#10b981",
    "goal": "만남과 헤어짐의 한국어 인사말을 때와 장소에 맞게 구사할 수 있다.",
    "grammar": [
      {
        "name": "인사말 격식 표현",
        "summary": "정중한 대인 인사",
        "details": "처음 만났을 때, 헤어질 때(떠나는 사람/남는 사람 구분)의 정중 어법입니다.",
        "examples": [
          "안녕히 가세요. (Good-bye - to someone leaving)",
          "안녕히 계세요. (Good-bye - to someone staying)",
          "만나서 반갑습니다. (Nice to meet you.)"
        ]
      },
      {
        "name": "사과와 감사의 표현",
        "summary": "감사와 사과",
        "details": "일상에서 호의나 배려를 받았을 때, 실수했을 때의 표준 공손 표현입니다.",
        "examples": [
          "감사합니다 / 고맙습니다.",
          "죄송합니다 / 미안합니다.",
          "아니에요 / 괜찮아요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "안녕하세요",
        "meaning": "Hello",
        "pron": "an-nyeong-ha-se-yo",
        "example": "안녕하세요, 저는 민수입니다."
      },
      {
        "word": "만나서 반갑습니다",
        "meaning": "Nice to meet you",
        "pron": "man-na-seo ban-gap-seum-ni-da",
        "example": "만나서 반갑습니다, 잘 부탁드립니다."
      },
      {
        "word": "안녕히 계세요",
        "meaning": "Goodbye (to one staying)",
        "pron": "an-nyeong-hi gye-se-yo",
        "example": "내일 뵙겠습니다. 안녕히 계세요."
      },
      {
        "word": "안녕히 가세요",
        "meaning": "Goodbye (to one leaving)",
        "pron": "an-nyeong-hi ga-se-yo",
        "example": "조심히 들어가세요. 안녕히 가세요."
      },
      {
        "word": "감사합니다",
        "meaning": "Thank you",
        "pron": "gam-sa-ham-ni-da",
        "example": "도와주셔서 대단히 감사합니다."
      },
      {
        "word": "천만에요",
        "meaning": "You're welcome",
        "pron": "cheon-man-e-yo",
        "example": "별말씀을요, 천만에요."
      },
      {
        "word": "죄송합니다",
        "meaning": "I am sorry (formal)",
        "pron": "joe-song-ham-ni-da",
        "example": "늦어서 정말 죄송합니다."
      },
      {
        "word": "괜찮아요",
        "meaning": "It is okay / No problem",
        "pron": "gwaen-chan-a-yo",
        "example": "다치지 않았으니 괜찮아요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 첫 만남 인사",
        "lines": [
          {
            "speaker": "민수",
            "role": "한국인 반장",
            "text": "안녕하세요? 저는 이민수입니다.",
            "trans": "Hello? I am Lee Min-soo."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "안녕하세요? 저는 투안입니다. 만나서 반갑습니다.",
            "trans": "Hello? I am Tuan. Nice to meet you."
          }
        ]
      },
      {
        "title": "대화 2: 퇴근길 작별 인사",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "반장님, 먼저 퇴근하겠습니다. 안녕히 계세요.",
            "trans": "Manager, I am leaving first. Good-bye."
          },
          {
            "speaker": "반장님",
            "role": "관리자",
            "text": "수고했어요, 투안 씨. 안녕히 가세요.",
            "trans": "Good job, Mr. Tuan. Good-bye."
          }
        ]
      }
    ],
    "culture": "한국의 인사법: 상대방의 눈을 마주친 뒤 허리를 약 30~45도 숙여 정중하게 인사합니다. 악수는 윗사람이 청할 때 두 손으로 잡습니다.",
    "quiz": [
      {
        "q": "내가 자리에 남고 상대방이 떠날 때 하는 인사는?",
        "options": [
          "안녕히 계세요",
          "안녕히 가세요",
          "감사합니다",
          "죄송합니다"
        ],
        "ans": 2,
        "exp": "가는 사람에게는 '안녕히 가세요'라고 합니다."
      },
      {
        "q": "내가 상대방의 발을 밟았을 때 해야 할 말은?",
        "options": [
          "고맙습니다",
          "축하합니다",
          "죄송합니다",
          "반갑습니다"
        ],
        "ans": 3,
        "exp": "실수나 폐를 끼쳤을 때는 '죄송합니다'라고 사과합니다."
      },
      {
        "q": "'만나서 반갑습니다'의 알맞은 응답은?",
        "options": [
          "네, 만나서 반갑습니다.",
          "네, 안녕히 가세요.",
          "아니요, 죄송합니다.",
          "천만에요."
        ],
        "ans": 1,
        "exp": "서로 초면 인사로 '만나서 반갑습니다'를 주고받습니다."
      },
      {
        "q": "감사 인사를 들었을 때 편안하게 답하는 말은?",
        "options": [
          "괜찮아요 / 아니에요",
          "실례합니다",
          "어서 오세요",
          "잘 가세요"
        ],
        "ans": 1,
        "exp": "감사 인사에 대해 '아니에요'나 '괜찮아요'로 겸손하게 답합니다."
      }
    ]
  },
  {
    "id": 5,
    "book": 1,
    "lessonNum": 5,
    "title": "주말 잘 보내세요",
    "titleEng": "Have a Nice Weekend (Farewells & Well Wishes)",
    "category": "기초 회화",
    "categoryColor": "#10b981",
    "goal": "주말이나 퇴근 시 직장 동료 및 상사와 따뜻한 격려와 덕담을 나눌 수 있다.",
    "grammar": [
      {
        "name": "잘 + 동사 (원만함/능숙함의 부사)",
        "summary": "기원과 축복",
        "details": "동사 앞에 '잘'을 붙여 원만한 상태나 만족스러운 결과를 바랍니다.",
        "examples": [
          "주말 잘 보내세요. (Have a nice weekend.)",
          "잘 먹겠습니다. (I will eat well.)",
          "잘 잤어요? (Did you sleep well?)"
        ]
      },
      {
        "name": "수고하셨습니다 (노고 치하)",
        "summary": "업무 마침 인사",
        "details": "하루 업무나 작업을 마쳤을 때 동료나 부하 직원에게 건네는 표준 인사입니다.",
        "examples": [
          "오늘도 수고하셨습니다. (Thank you for your hard work today.)",
          "수고하세요. (Keep up the good work.)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "주말",
        "meaning": "Weekend",
        "pron": "ju-mal",
        "example": "주말에 친구를 만나요."
      },
      {
        "word": "보내다",
        "meaning": "To spend (time) / to send",
        "pron": "bo-nae-da",
        "example": "즐거운 주말을 보내세요."
      },
      {
        "word": "수고하다",
        "meaning": "To work hard",
        "pron": "su-go-ha-da",
        "example": "오늘 하루도 수고하셨습니다."
      },
      {
        "word": "축하하다",
        "meaning": "To congratulate",
        "pron": "chuk-ha-ha-da",
        "example": "생일을 진심으로 축하해요."
      },
      {
        "word": "잘 자요",
        "meaning": "Good night (casual)",
        "pron": "jal ja-yo",
        "example": "피곤할 텐데 일찍 잘 자요."
      },
      {
        "word": "안녕히 주무세요",
        "meaning": "Good night (honorific)",
        "pron": "an-nyeong-hi ju-mu-se-yo",
        "example": "어르신, 안녕히 주무세요."
      },
      {
        "word": "잘 먹겠습니다",
        "meaning": "I will eat well (before meal)",
        "pron": "jal meok-get-seum-ni-da",
        "example": "맛있게 잘 먹겠습니다."
      },
      {
        "word": "잘 먹었습니다",
        "meaning": "I ate well (after meal)",
        "pron": "jal meok-eot-seum-ni-da",
        "example": "배부르게 잘 먹었습니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 금요일 퇴근 인사",
        "lines": [
          {
            "speaker": "반장님",
            "role": "관리자",
            "text": "투안 씨, 이번 주도 일하느라 고생 많았어요. 주말 잘 보내요.",
            "trans": "Mr. Tuan, you worked hard this week. Have a great weekend."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "감사합니다! 반장님도 주말 잘 보내세요.",
            "trans": "Thank you! You have a great weekend too, Manager."
          }
        ]
      },
      {
        "title": "대화 2: 식사 시간 인사",
        "lines": [
          {
            "speaker": "수루",
            "role": "동료",
            "text": "점심 맛있게 드세요.",
            "trans": "Enjoy your lunch."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 잘 먹겠습니다!",
            "trans": "Yes, thank you for the food!"
          }
        ]
      }
    ],
    "culture": "한국의 '수고하셨습니다' 어법: 윗사람에게는 '수고하셨습니다' 대신 '고생 많으셨습니다'나 '감사합니다'를 쓰는 것이 더 정중한 직장 예절입니다.",
    "quiz": [
      {
        "q": "금요일 퇴근하면서 동료에게 건네는 알맞은 인사는?",
        "options": [
          "새해 복 많이 받으세요",
          "주말 잘 보내세요",
          "생일 축하합니다",
          "어서 오세요"
        ],
        "ans": 2,
        "exp": "주말을 앞두고는 '주말 잘 보내세요'라고 인사합니다."
      },
      {
        "q": "식사를 시작하기 전에 한국에서 하는 예의 바른 인사는?",
        "options": [
          "잘 먹었습니다",
          "잘 먹겠습니다",
          "안녕히 계세요",
          "수고하세요"
        ],
        "ans": 2,
        "exp": "식사 전에는 '잘 먹겠습니다'라고 인사합니다."
      },
      {
        "q": "생일을 맞이한 친구에게 건네는 말은?",
        "options": [
          "축하합니다",
          "죄송합니다",
          "괜찮습니다",
          "실례합니다"
        ],
        "ans": 1,
        "exp": "경사스러운 일에는 '축하합니다'라고 말합니다."
      },
      {
        "q": "하루 일과가 모두 끝났을 때 함께 일한 동료에게 건네는 인사는?",
        "options": [
          "처음 뵙겠습니다",
          "수고하셨습니다",
          "안녕히 주무셨어요",
          "맛있게 드세요"
        ],
        "ans": 2,
        "exp": "하루 일을 마쳤을 때는 '수고하셨습니다'라고 인사합니다."
      }
    ]
  },
  {
    "id": 6,
    "book": 1,
    "lessonNum": 6,
    "title": "저는 투안입니다",
    "titleEng": "I am Tuan (Self-Introduction & Nationality)",
    "category": "자기소개",
    "categoryColor": "#8b5cf6",
    "goal": "자신의 이름과 국적, 직업을 한국어로 당당하게 소개할 수 있다.",
    "grammar": [
      {
        "name": "입니다 / 입니까? (격식체 서술/의문)",
        "summary": "체언 서술격 조사 격식체",
        "details": "명사 뒤에 붙어 주어의 신분, 이름, 국적을 정중하게 나타냅니다. 의문문은 '입니까?'를 씁니다.",
        "examples": [
          "저는 투안입니다. (I am Tuan.)",
          "어느 나라 사람입니까? (Which country are you from?)"
        ]
      },
      {
        "name": "은 / 는 (주제 보조사)",
        "summary": "문장의 화제 표시",
        "details": "앞 명사에 받침이 있으면 '은', 받침이 없으면 '는'을 붙여 문장의 주제를 제시합니다.",
        "examples": [
          "저는 베트남 사람입니다. (I am Vietnamese.)",
          "선생님은 한국 사람입니다. (The teacher is Korean.)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "베트남",
        "meaning": "Vietnam",
        "pron": "be-teu-nam",
        "example": "저는 베트남에서 왔습니다."
      },
      {
        "word": "네팔",
        "meaning": "Nepal",
        "pron": "ne-pal",
        "example": "수루 씨는 네팔 사람입니다."
      },
      {
        "word": "캄보디아",
        "meaning": "Cambodia",
        "pron": "kam-bo-di-a",
        "example": "캄보디아는 날씨가 따뜻해요."
      },
      {
        "word": "미얀마",
        "meaning": "Myanmar",
        "pron": "mi-yan-ma",
        "example": "미얀마 친구와 일해요."
      },
      {
        "word": "회사원",
        "meaning": "Office Worker",
        "pron": "hoe-sa-won",
        "example": "민수 씨는 회사원입니다."
      },
      {
        "word": "근로자",
        "meaning": "Worker / Laborer",
        "pron": "geun-ro-ja",
        "example": "공장에서 일하는 근로자입니다."
      },
      {
        "word": "의사",
        "meaning": "Doctor",
        "pron": "ui-sa",
        "example": "병원의 의사 선생님입니다."
      },
      {
        "word": "목수",
        "meaning": "Carpenter",
        "pron": "mok-su",
        "example": "가구를 만드는 목수입니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 이름과 국적 묻기",
        "lines": [
          {
            "speaker": "민수",
            "role": "한국인 반장",
            "text": "안녕하세요? 저는 이민수입니다. 어느 나라 사람입니까?",
            "trans": "Hello? I am Lee Min-soo. Which country are you from?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "저는 베트남 사람입니다. 이름은 투안입니다.",
            "trans": "I am Vietnamese. My name is Tuan."
          }
        ]
      },
      {
        "title": "대화 2: 직업 소개",
        "lines": [
          {
            "speaker": "수루",
            "role": "외국인 근로자",
            "text": "투안 씨는 회사원입니까?",
            "trans": "Mr. Tuan, are you an office worker?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "아니요, 저는 가구 공장 근로자입니다.",
            "trans": "No, I am a furniture factory worker."
          }
        ]
      }
    ],
    "culture": "한국의 16개 EPS 송출국: 베트남, 필리핀, 태국, 인도네시아, 스리랑카, 몽골, 우즈베키스탄, 파키스탄, 캄보디아, 중국, 방글라데시, 네팔, 미얀마, 키르기스스탄, 동티모르, 라오스.",
    "quiz": [
      {
        "q": "'저는 베트남 ( )입니다.' 빈칸에 들어갈 말은?",
        "options": [
          "나라",
          "사람",
          "선생",
          "이름"
        ],
        "ans": 2,
        "exp": "국적을 말할 때는 '국가명 + 사람' 구조를 씁니다."
      },
      {
        "q": "'어느 나라 사람입니까?'에 대한 대답으로 알맞은 것은?",
        "options": [
          "네팔 사람입니다.",
          "투안입니다.",
          "회사에 갑니다.",
          "네, 그렇습니다."
        ],
        "ans": 1,
        "exp": "국적을 묻는 질문에는 '네팔 사람입니다'처럼 출신국을 답합니다."
      },
      {
        "q": "앞 단어에 받침이 있을 때 붙는 보조사는?",
        "options": [
          "는",
          "은",
          "를",
          "가"
        ],
        "ans": 2,
        "exp": "받침이 있는 체언 뒤에는 '은'이 결합합니다. (예: 선생님은)"
      },
      {
        "q": "'의사'라는 직업의 의미는 무엇입니까?",
        "options": [
          "환자를 치료하는 사람",
          "가구를 만드는 사람",
          "음식을 요리하는 사람",
          "물건을 파는 사람"
        ],
        "ans": 1,
        "exp": "의사는 병원에서 아픈 사람을 진료하고 치료하는 전문직입니다."
      }
    ]
  },
  {
    "id": 7,
    "book": 1,
    "lessonNum": 7,
    "title": "여기가 사무실이에요",
    "titleEng": "This is the Office (Locations & Objects)",
    "category": "직장 환경",
    "categoryColor": "#f59e0b",
    "goal": "작업장과 사무실의 장소를 지칭하고 일상 사물의 이름을 묻고 답할 수 있다.",
    "grammar": [
      {
        "name": "이/가 (주격 조사)",
        "summary": "주어 표시",
        "details": "받침이 있으면 '이', 없으면 '가'를 붙여 문장의 주어를 분명하게 나타냅니다.",
        "examples": [
          "여기가 사무실입니다. (This place is the office.)",
          "화장실이 어디입니까? (Where is the restroom?)"
        ]
      },
      {
        "name": "여기 / 거기 / 저기 (장소 지시대명사)",
        "summary": "거리별 위치 지칭",
        "details": "화자와 청자의 위치에 따라 여기(가까움), 거기(청자 근처), 저기(둘 다 먼 곳)로 구분합니다.",
        "examples": [
          "여기는 기숙사예요. (Here is the dormitory.)",
          "저기가 식당입니다. (Over there is the cafeteria.)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "사무실",
        "meaning": "Office",
        "pron": "sa-mu-sil",
        "example": "반장님이 사무실에 계세요."
      },
      {
        "word": "기숙사",
        "meaning": "Dormitory",
        "pron": "gi-suk-sa",
        "example": "퇴근 후 기숙사로 갑니다."
      },
      {
        "word": "화장실",
        "meaning": "Restroom / Toilet",
        "pron": "hwa-jang-sil",
        "example": "화장실이 복도 끝에 있어요."
      },
      {
        "word": "식당",
        "meaning": "Cafeteria / Restaurant",
        "pron": "sik-dang",
        "example": "식당에서 점심을 먹어요."
      },
      {
        "word": "세탁실",
        "meaning": "Laundry Room",
        "pron": "se-tak-sil",
        "example": "세탁실에서 빨래를 합니다."
      },
      {
        "word": "열쇠",
        "meaning": "Key",
        "pron": "yeol-soe",
        "example": "기숙사 방 열쇠를 챙기세요."
      },
      {
        "word": "이불",
        "meaning": "Blanket / Quilt",
        "pron": "i-bul",
        "example": "따뜻한 이불을 덮어요."
      },
      {
        "word": "베개",
        "meaning": "Pillow",
        "pron": "be-gae",
        "example": "베개를 베고 잡니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 회사 시설 안내",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "여기가 사무실입니까?",
            "trans": "Is this place the office?"
          },
          {
            "speaker": "민수",
            "role": "한국인 반장",
            "text": "네, 사무실입니다. 저기는 화장실이에요.",
            "trans": "Yes, it is the office. Over there is the restroom."
          }
        ]
      },
      {
        "title": "대화 2: 기숙사 물품 확인",
        "lines": [
          {
            "speaker": "리한",
            "role": "외국인 근로자",
            "text": "이것이 기숙사 열쇠입니까?",
            "trans": "Is this the dormitory key?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 맞아요. 열쇠입니다.",
            "trans": "Yes, that's right. It is the key."
          }
        ]
      }
    ],
    "culture": "한국의 주거 시설과 분리수거: 기숙사 생활 시 쓰레기 분리배출(일반/재활용/음식물) 규정을 준수해야 벌금을 피할 수 있습니다.",
    "quiz": [
      {
        "q": "'화장실( ) 어디입니까?' 알맞은 조사는?",
        "options": [
          "이",
          "가",
          "을",
          "는"
        ],
        "ans": 1,
        "exp": "'화장실'에 받침 ㄹ이 있으므로 주격 조사 '이'가 결합합니다."
      },
      {
        "q": "먼 곳을 가리키는 장소 지시대명사는?",
        "options": [
          "여기",
          "거기",
          "저기",
          "어디"
        ],
        "ans": 3,
        "exp": "화자와 청자 모두에게서 멀리 떨어진 장소는 '저기'라고 합니다."
      },
      {
        "q": "기숙사에서 잠잘 때 덮는 침구류는?",
        "options": [
          "베개",
          "이불",
          "열쇠",
          "수건"
        ],
        "ans": 2,
        "exp": "몸을 덮는 침구는 '이불'입니다."
      },
      {
        "q": "세탁실에서 하는 일은 무엇입니까?",
        "options": [
          "식사를 한다",
          "빨래를 한다",
          "업무 회의를 한다",
          "잠을 잔다"
        ],
        "ans": 2,
        "exp": "세탁실(laundry room)은 빨래를 하는 공간입니다."
      }
    ]
  },
  {
    "id": 8,
    "book": 1,
    "lessonNum": 8,
    "title": "12시 30분에 점심을 먹어요",
    "titleEng": "I Eat Lunch at 12:30 (Daily Routine & Time)",
    "category": "일상 생활",
    "categoryColor": "#06b6d4",
    "goal": "하루 일과와 시각을 한국어로 표현하고, 시간 관련 조사를 정확히 쓸 수 있다.",
    "grammar": [
      {
        "name": "-아요 / -어요 (비격식 해요체 어미)",
        "summary": "일상 대화 서술",
        "details": "양성모음(ㅏ, ㅗ) 뒤에는 -아요, 음성모음 뒤에는 -어요, 하다는 해요로 활용됩니다.",
        "examples": [
          "밥을 먹어요. (I eat rice.)",
          "일해요. (I work.)",
          "집에 가요. (I go home.)"
        ]
      },
      {
        "name": "시간 명사 + 에 (시간 조사)",
        "summary": "동작의 발생 시점",
        "details": "행동이 일어나는 특정 시각이나 날짜 뒤에 붙어 시점을 나타냅니다.",
        "examples": [
          "8시에 출근해요. (I go to work at 8 o'clock.)",
          "몇 시에 자요? (What time do you sleep?)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "일어나다",
        "meaning": "To wake up / get up",
        "pron": "il-eo-na-da",
        "example": "아침 6시에 일어나요."
      },
      {
        "word": "씻다",
        "meaning": "To wash up",
        "pron": "ssit-da",
        "example": "얼굴과 손을 깨끗이 씻어요."
      },
      {
        "word": "출근하다",
        "meaning": "To go to work",
        "pron": "chul-geun-ha-da",
        "example": "8시 반에 회사로 출근해요."
      },
      {
        "word": "퇴근하다",
        "meaning": "To leave work",
        "pron": "toe-geun-ha-da",
        "example": "오후 6시에 퇴근합니다."
      },
      {
        "word": "점심",
        "meaning": "Lunch",
        "pron": "jeom-sim",
        "example": "점심시간은 12시부터예요."
      },
      {
        "word": "야근하다",
        "meaning": "To work overtime at night",
        "pron": "ya-geun-ha-da",
        "example": "바빠서 2시간 야근해요."
      },
      {
        "word": "요리하다",
        "meaning": "To cook",
        "pron": "yo-ri-ha-da",
        "example": "저녁에 찌개를 요리해요."
      },
      {
        "word": "자다",
        "meaning": "To sleep",
        "pron": "ja-da",
        "example": "밤 11시에 잠을 자요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 시간 묻기",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "지금 몇 시예요?",
            "trans": "What time is it right now?"
          },
          {
            "speaker": "리한",
            "role": "외국인 근로자",
            "text": "11시예요. 조금 후면 점심시간이에요.",
            "trans": "It is 11 o'clock. Soon it will be lunchtime."
          }
        ]
      },
      {
        "title": "대화 2: 일과 묻고 답하기",
        "lines": [
          {
            "speaker": "민수",
            "role": "한국인 반장",
            "text": "투안 씨는 보통 몇 시에 자요?",
            "trans": "Mr. Tuan, what time do you usually sleep?"
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "밤 11시에 자요. 아침에는 6시에 일어나요.",
            "trans": "I sleep at 11 PM. In the morning, I wake up at 6 AM."
          }
        ]
      }
    ],
    "culture": "한국의 출근 시간 문화: 통상 업무 시작 시간인 9시보다 10~15분 일찍 도착하여 작업 도구를 정리하고 체조하는 것이 관례입니다.",
    "quiz": [
      {
        "q": "'오전 9시( ) 출근해요.' 괄호 안에 들어갈 시간 조사는?",
        "options": [
          "에",
          "에서",
          "을",
          "로"
        ],
        "ans": 1,
        "exp": "시간을 나타내는 명사 뒤에는 조사 '에'가 옵니다."
      },
      {
        "q": "'먹다'의 비격식 해요체 어미 결합형은?",
        "options": [
          "먹아요",
          "먹어요",
          "먹해요",
          "먹세요"
        ],
        "ans": 2,
        "exp": "어간 모음이 ㅓ(음성)이므로 '-어요'가 결합하여 '먹어요'가 됩니다."
      },
      {
        "q": "일을 끝내고 집으로 돌아가는 행동은?",
        "options": [
          "출근하다",
          "퇴근하다",
          "야근하다",
          "지각하다"
        ],
        "ans": 2,
        "exp": "업무를 마치고 돌아가는 것은 '퇴근하다'입니다."
      },
      {
        "q": "12시 30분을 한글 시각으로 바르게 읽은 것은?",
        "options": [
          "열두 시 삼십 분",
          "십이 시 서른 분",
          "열두 시 서른 분",
          "십이 시 삼십 분"
        ],
        "ans": 1,
        "exp": "시간은 고유어 수사(열두 시), 분은 한자어 수사(삼십 분)를 씁니다."
      }
    ]
  },
  {
    "id": 9,
    "book": 1,
    "lessonNum": 9,
    "title": "가족이 몇 명이에요?",
    "titleEng": "How Many Family Members Do You Have? (Family & Appearance)",
    "category": "인물·가족",
    "categoryColor": "#ec4899",
    "goal": "가족 구성원을 묻고 답하며, 사람의 외모와 성격을 묘사할 수 있다.",
    "grammar": [
      {
        "name": "명사 + 하고 (접속 조사)",
        "summary": "명사와 명사의 대등 연결",
        "details": "두 개 이상의 명사를 대등하게 나열할 때 쓰이며 구어체에서 매우 빈번합니다.",
        "examples": [
          "부모님하고 살아요. (I live with my parents.)",
          "형하고 동생이 있어요. (I have an older brother and a younger sibling.)"
        ]
      },
      {
        "name": "에 있다 / 없다 (존재 표현)",
        "summary": "사람이나 사물의 존재/소유",
        "details": "장소나 대상에 사람 또는 사물이 있거나 없음을 나타냅니다.",
        "examples": [
          "고향에 가족이 있어요. (I have family in my hometown.)",
          "형은 없어요. (I don't have an older brother.)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "부모님",
        "meaning": "Parents",
        "pron": "bu-mo-nim",
        "example": "부모님이 베트남에 계세요."
      },
      {
        "word": "아버지",
        "meaning": "Father",
        "pron": "a-beo-ji",
        "example": "아버지는 농사를 지으세요."
      },
      {
        "word": "어머니",
        "meaning": "Mother",
        "pron": "eo-meo-ni",
        "example": "어머니 요리가 제일 맛있어요."
      },
      {
        "word": "형",
        "meaning": "Older brother (for male)",
        "pron": "hyeong",
        "example": "형은 한국에서 일해요."
      },
      {
        "word": "누나",
        "meaning": "Older sister (for male)",
        "pron": "nu-na",
        "example": "누나가 결혼했어요."
      },
      {
        "word": "동생",
        "meaning": "Younger sibling",
        "pron": "dong-saeng",
        "example": "동생은 학생입니다."
      },
      {
        "word": "친절하다",
        "meaning": "Kind / Friendly",
        "pron": "chin-jeol-ha-da",
        "example": "동료들이 아주 친절해요."
      },
      {
        "word": "키가 크다",
        "meaning": "Tall",
        "pron": "ki-ga keu-da",
        "example": "리한 씨는 키가 커요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 가족 수 묻기",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "리한 씨는 가족이 몇 명이에요?",
            "trans": "Mr. Rihan, how many family members do you have?"
          },
          {
            "speaker": "리한",
            "role": "외국인 근로자",
            "text": "어머니하고 형하고 저, 세 명이에요. 투안 씨는요?",
            "trans": "Mother, older brother, and me: three people. What about you, Mr. Tuan?"
          }
        ]
      },
      {
        "title": "대화 2: 동생 묘사",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "이 사진의 사람이 여동생이에요? 참 예뻐요.",
            "trans": "Is the person in this photo your younger sister? She is very pretty."
          },
          {
            "speaker": "민수",
            "role": "한국인 반장",
            "text": "네, 제 동생이에요. 키가 크고 착해요.",
            "trans": "Yes, she is my sister. She is tall and kind-hearted."
          }
        ]
      }
    ],
    "culture": "한국의 호칭과 높임말: 한국에서는 나이나 서열에 따라 형, 누나, 오빠, 언니 등 부르는 말이 다르며, 웃어른께는 '있으시다' 대신 '계시다'를 씁니다.",
    "quiz": [
      {
        "q": "남자가 나이 많은 친형제를 부를 때 쓰는 호칭은?",
        "options": [
          "형",
          "오빠",
          "누나",
          "언니"
        ],
        "ans": 1,
        "exp": "남자가 손위 남자 형제를 부를 때는 '형'이라고 합니다."
      },
      {
        "q": "'아버지( ) 어머니가 계십니다.' 나열 조사로 알맞은 것은?",
        "options": [
          "하고",
          "에서",
          "에게",
          "의"
        ],
        "ans": 1,
        "exp": "두 명사를 연결하는 접속 조사는 '하고'입니다."
      },
      {
        "q": "남을 배려하고 따뜻하게 대하는 성격은?",
        "options": [
          "불친절하다",
          "친절하다",
          "무섭다",
          "게으르다"
        ],
        "ans": 2,
        "exp": "상냥하고 배려심 있는 태도는 '친절하다'입니다."
      },
      {
        "q": "사람 수를 셀 때 쓰는 고유어 단위 명사는?",
        "options": [
          "개",
          "병",
          "명",
          "권"
        ],
        "ans": 3,
        "exp": "사람 수를 셀 때는 '명(분)'을 씁니다. (예: 세 명)"
      }
    ]
  },
  {
    "id": 10,
    "book": 1,
    "lessonNum": 10,
    "title": "어제 도서관에서 한국어를 공부했어요",
    "titleEng": "Yesterday I Studied Korean at the Library",
    "category": "과거 일과",
    "categoryColor": "#06b6d4",
    "goal": "과거 시제(-았/었-)를 사용하여 어제나 지난 주말에 한 일을 설명할 수 있다.",
    "grammar": [
      {
        "name": "-았/었/였- (과거 시제 선어말어미)",
        "summary": "과거 완료 동작",
        "details": "양성모음은 -았-, 음성모음은 -었-, 하다는 '했-'으로 과거 일어난 동작을 나타냅니다.",
        "examples": [
          "공부했어요. (I studied.)",
          "밥을 먹었어요. (I ate rice.)",
          "친구를 만났어요. (I met a friend.)"
        ]
      },
      {
        "name": "장소 명사 + 에서 (행동 장소)",
        "summary": "동작이 일어나는 공간",
        "details": "특정 장소에서 어떤 능동적 동작이나 활동이 일어남을 나타냅니다.",
        "examples": [
          "도서관에서 책을 읽어요. (I read books in the library.)",
          "시장에서 옷을 샀어요. (I bought clothes at the market.)"
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "어제",
        "meaning": "Yesterday",
        "pron": "eo-je",
        "example": "어제 야근을 안 했어요."
      },
      {
        "word": "오늘",
        "meaning": "Today",
        "pron": "o-neul",
        "example": "오늘 한국어 시험을 봐요."
      },
      {
        "word": "내일",
        "meaning": "Tomorrow",
        "pron": "nae-il",
        "example": "내일은 주말이라 쉬어요."
      },
      {
        "word": "지난주",
        "meaning": "Last week",
        "pron": "ji-nan-ju",
        "example": "지난주에 월급을 받았어요."
      },
      {
        "word": "도서관",
        "meaning": "Library",
        "pron": "do-seo-gwan",
        "example": "도서관에서 책을 빌려요."
      },
      {
        "word": "영화관",
        "meaning": "Cinema / Theater",
        "pron": "yeong-hwa-gwan",
        "example": "영화관에서 영화를 봐요."
      },
      {
        "word": "산책하다",
        "meaning": "To take a walk",
        "pron": "san-chaek-ha-da",
        "example": "공원에서 산책했어요."
      },
      {
        "word": "쇼핑하다",
        "meaning": "To go shopping",
        "pron": "syo-ping-ha-da",
        "example": "마트에서 식료품을 쇼핑해요."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 주말 활동 묻기",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "수루 씨는 지난 주말에 뭐 했어요?",
            "trans": "Ms. Suru, what did you do last weekend?"
          },
          {
            "speaker": "수루",
            "role": "외국인 근로자",
            "text": "친구하고 영화관에서 한국 영화를 봤어요. 투안 씨는요?",
            "trans": "I watched a Korean movie at the theater with my friend. How about you?"
          }
        ]
      },
      {
        "title": "대화 2: 어제 공부 이야기",
        "lines": [
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "저는 도서관에서 한국어를 열심히 공부했어요.",
            "trans": "I studied Korean diligently at the library."
          },
          {
            "speaker": "민수",
            "role": "한국인 반장",
            "text": "참 대단하네요! 시험 꼭 합격할 거예요.",
            "trans": "That's wonderful! You will definitely pass the exam."
          }
        ]
      }
    ],
    "culture": "한국의 요일 명칭: 일(태양), 월(달), 화(불), 수(물), 목(나무), 금(쇠), 토(흙) - 동양 오행 사상에서 유래되었습니다.",
    "quiz": [
      {
        "q": "'공부하다'의 과거형은 무엇입니까?",
        "options": [
          "공부하요",
          "공부했어요",
          "공부았어요",
          "공부겠어요"
        ],
        "ans": 2,
        "exp": "'하다' 동사의 과거형은 불규칙으로 '했어요'가 됩니다."
      },
      {
        "q": "'식당( ) 밥을 먹었습니다.' 알맞은 조사는?",
        "options": [
          "에",
          "에서",
          "으로",
          "과"
        ],
        "ans": 2,
        "exp": "동작이 일어나는 활동 장소에는 조사 '에서'를 씁니다."
      },
      {
        "q": "'어제'의 반대 개념으로 '오는 날(다음 날)'을 뜻하는 말은?",
        "options": [
          "그저께",
          "오늘",
          "내일",
          "모레"
        ],
        "ans": 3,
        "exp": "어제의 다음은 오늘, 오늘의 다음 날은 '내일'입니다."
      },
      {
        "q": "영화를 상영하고 관람하는 장소는?",
        "options": [
          "도서관",
          "우체국",
          "영화관",
          "은행"
        ],
        "ans": 3,
        "exp": "영화는 '영화관(극장)'에서 봅니다."
      }
    ]
  },
  {
    "id": 11,
    "book": 1,
    "lessonNum": 11,
    "title": "사과 다섯 개 주세요",
    "titleEng": "Please Give Me Five Apples (Shopping & Counters)",
    "category": "물건 구매",
    "categoryColor": "#10b981",
    "goal": "가게에서 가격을 묻고 물건을 구매할 수 있다.",
    "grammar": [
      {
        "name": "주세요",
        "summary": "사과 다섯 개 주세요 핵심 문법",
        "details": "단원 11과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 주세요 완료해야 합니다.",
          "반장님과 함께 주세요 상의하세요."
        ]
      },
      {
        "name": "아/어 주다",
        "summary": "사과 다섯 개 주세요 핵심 문법",
        "details": "단원 11과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 아/어 주다 완료해야 합니다.",
          "반장님과 함께 아/어 주다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "과일",
        "meaning": "Standard term for 과일",
        "pron": "korean-pron",
        "example": "과일 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "식료품",
        "meaning": "Standard term for 식료품",
        "pron": "korean-pron",
        "example": "식료품 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "화폐 단위",
        "meaning": "Standard term for 화폐 단위",
        "pron": "korean-pron",
        "example": "화폐 단위 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 사과 다섯 개 주세요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 사과 다섯 개 주세요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '사과 다섯 개 주세요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 과일 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 과일 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제11과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제11과 '사과 다섯 개 주세요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "가게에서 가격을 묻고 물건을 구매할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제11과의 핵심 목표는 '가게에서 가격을 묻고 물건을 구매할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제11과의 핵심 문법 '주세요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '과일'의 의미로 가장 알맞은 것은?",
        "options": [
          "제11과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제11과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 12,
    "book": 1,
    "lessonNum": 12,
    "title": "병원 옆에 약국이 있어요",
    "titleEng": "There is a Pharmacy Next to the Hospital",
    "category": "위치와 길찾기",
    "categoryColor": "#3b82f6",
    "goal": "위치와 방향을 묻고 길을 안내할 수 있다.",
    "grammar": [
      {
        "name": "(으)세요",
        "summary": "병원 옆에 약국이 있어요 핵심 문법",
        "details": "단원 12과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 (으)세요 완료해야 합니다.",
          "반장님과 함께 (으)세요 상의하세요."
        ]
      },
      {
        "name": "(으)로",
        "summary": "병원 옆에 약국이 있어요 핵심 문법",
        "details": "단원 12과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 (으)로 완료해야 합니다.",
          "반장님과 함께 (으)로 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "병원",
        "meaning": "Standard term for 병원",
        "pron": "korean-pron",
        "example": "병원 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "약국",
        "meaning": "Standard term for 약국",
        "pron": "korean-pron",
        "example": "약국 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "우체국",
        "meaning": "Standard term for 우체국",
        "pron": "korean-pron",
        "example": "우체국 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "방향(앞/뒤/옆/위/아래)",
        "meaning": "Standard term for 방향(앞/뒤/옆/위/아래)",
        "pron": "korean-pron",
        "example": "방향(앞/뒤/옆/위/아래) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 병원 옆에 약국이 있어요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 병원 옆에 약국이 있어요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '병원 옆에 약국이 있어요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 병원 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 병원 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제12과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제12과 '병원 옆에 약국이 있어요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "위치와 방향을 묻고 길을 안내할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제12과의 핵심 목표는 '위치와 방향을 묻고 길을 안내할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제12과의 핵심 문법 '(으)세요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '병원'의 의미로 가장 알맞은 것은?",
        "options": [
          "제12과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제12과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 13,
    "book": 1,
    "lessonNum": 13,
    "title": "시청 앞에서 7시에 만나요",
    "titleEng": "Let's Meet in Front of City Hall at 7",
    "category": "약속과 일정",
    "categoryColor": "#8b5cf6",
    "goal": "약속 시간과 장소를 정하고 제안할 수 있다.",
    "grammar": [
      {
        "name": "-고 싶다",
        "summary": "시청 앞에서 7시에 만나요 핵심 문법",
        "details": "단원 13과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -고 싶다 완료해야 합니다.",
          "반장님과 함께 -고 싶다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ까요",
        "summary": "시청 앞에서 7시에 만나요 핵심 문법",
        "details": "단원 13과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ까요 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ까요 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "약속",
        "meaning": "Standard term for 약속",
        "pron": "korean-pron",
        "example": "약속 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "시청",
        "meaning": "Standard term for 시청",
        "pron": "korean-pron",
        "example": "시청 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "지하철역",
        "meaning": "Standard term for 지하철역",
        "pron": "korean-pron",
        "example": "지하철역 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "시간대",
        "meaning": "Standard term for 시간대",
        "pron": "korean-pron",
        "example": "시간대 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 시청 앞에서 7시에 만나요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 시청 앞에서 7시에 만나요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '시청 앞에서 7시에 만나요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 약속 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 약속 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제13과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제13과 '시청 앞에서 7시에 만나요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "약속 시간과 장소를 정하고 제안할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제13과의 핵심 목표는 '약속 시간과 장소를 정하고 제안할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제13과의 핵심 문법 '-고 싶다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '약속'의 의미로 가장 알맞은 것은?",
        "options": [
          "제13과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제13과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 14,
    "book": 1,
    "lessonNum": 14,
    "title": "저는 비빔밥을 먹을래요",
    "titleEng": "I Would Like to Eat Bibimbap (Ordering Food)",
    "category": "음식 주문",
    "categoryColor": "#f59e0b",
    "goal": "식당에서 음식을 주문하고 맛을 표현할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄹ래요",
        "summary": "저는 비빔밥을 먹을래요 핵심 문법",
        "details": "단원 14과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ래요 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ래요 상의하세요."
        ]
      },
      {
        "name": "안 + 동사",
        "summary": "저는 비빔밥을 먹을래요 핵심 문법",
        "details": "단원 14과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 안 + 동사 완료해야 합니다.",
          "반장님과 함께 안 + 동사 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "식당 메뉴",
        "meaning": "Standard term for 식당 메뉴",
        "pron": "korean-pron",
        "example": "식당 메뉴 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "맛(맵다/달다/짜다/싱겁다)",
        "meaning": "Standard term for 맛(맵다/달다/짜다/싱겁다)",
        "pron": "korean-pron",
        "example": "맛(맵다/달다/짜다/싱겁다) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 저는 비빔밥을 먹을래요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 저는 비빔밥을 먹을래요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '저는 비빔밥을 먹을래요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 식당 메뉴 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 식당 메뉴 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제14과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제14과 '저는 비빔밥을 먹을래요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "식당에서 음식을 주문하고 맛을 표현할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제14과의 핵심 목표는 '식당에서 음식을 주문하고 맛을 표현할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제14과의 핵심 문법 '-(으)ㄹ래요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '식당 메뉴'의 의미로 가장 알맞은 것은?",
        "options": [
          "제14과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제14과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 15,
    "book": 1,
    "lessonNum": 15,
    "title": "날씨가 맑아서 기분이 좋아요",
    "titleEng": "The Weather is Clear, So I Feel Great",
    "category": "날씨와 감정",
    "categoryColor": "#06b6d4",
    "goal": "날씨를 묘사하고 기분과 감정을 나눌 수 있다.",
    "grammar": [
      {
        "name": "-네요",
        "summary": "날씨가 맑아서 기분이 좋아요 핵심 문법",
        "details": "단원 15과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -네요 완료해야 합니다.",
          "반장님과 함께 -네요 상의하세요."
        ]
      },
      {
        "name": "-아서/어서",
        "summary": "날씨가 맑아서 기분이 좋아요 핵심 문법",
        "details": "단원 15과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아서/어서 완료해야 합니다.",
          "반장님과 함께 -아서/어서 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "계절(봄/여름/가을/겨울)",
        "meaning": "Standard term for 계절(봄/여름/가을/겨울)",
        "pron": "korean-pron",
        "example": "계절(봄/여름/가을/겨울) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "날씨",
        "meaning": "Standard term for 날씨",
        "pron": "korean-pron",
        "example": "날씨 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "기분",
        "meaning": "Standard term for 기분",
        "pron": "korean-pron",
        "example": "기분 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 날씨가 맑아서 기분이 좋아요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 날씨가 맑아서 기분이 좋아요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '날씨가 맑아서 기분이 좋아요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 계절(봄/여름/가을/겨울) 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 계절(봄/여름/가을/겨울) ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제15과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제15과 '날씨가 맑아서 기분이 좋아요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "날씨를 묘사하고 기분과 감정을 나눌 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제15과의 핵심 목표는 '날씨를 묘사하고 기분과 감정을 나눌 수 있다.'입니다."
      },
      {
        "q": "다음 중 제15과의 핵심 문법 '-네요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '계절(봄/여름/가을/겨울)'의 의미로 가장 알맞은 것은?",
        "options": [
          "제15과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제15과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 16,
    "book": 1,
    "lessonNum": 16,
    "title": "시간이 있을 때 주로 테니스를 쳐요",
    "titleEng": "When I Have Time, I Usually Play Tennis",
    "category": "취미와 여가",
    "categoryColor": "#10b981",
    "goal": "취미 활동을 묻고 여가 생활을 말할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄹ 때",
        "summary": "시간이 있을 때 주로 테니스를 쳐요 핵심 문법",
        "details": "단원 16과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 때 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 때 상의하세요."
        ]
      },
      {
        "name": "-(으)러 가다",
        "summary": "시간이 있을 때 주로 테니스를 쳐요 핵심 문법",
        "details": "단원 16과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)러 가다 완료해야 합니다.",
          "반장님과 함께 -(으)러 가다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "취미",
        "meaning": "Standard term for 취미",
        "pron": "korean-pron",
        "example": "취미 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "운동",
        "meaning": "Standard term for 운동",
        "pron": "korean-pron",
        "example": "운동 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "악기",
        "meaning": "Standard term for 악기",
        "pron": "korean-pron",
        "example": "악기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "빈도 부사",
        "meaning": "Standard term for 빈도 부사",
        "pron": "korean-pron",
        "example": "빈도 부사 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 시간이 있을 때 주로 테니스를 쳐요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 시간이 있을 때 주로 테니스를 쳐요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '시간이 있을 때 주로 테니스를 쳐요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 취미 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 취미 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제16과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제16과 '시간이 있을 때 주로 테니스를 쳐요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "취미 활동을 묻고 여가 생활을 말할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제16과의 핵심 목표는 '취미 활동을 묻고 여가 생활을 말할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제16과의 핵심 문법 '-(으)ㄹ 때'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '취미'의 의미로 가장 알맞은 것은?",
        "options": [
          "제16과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제16과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 17,
    "book": 1,
    "lessonNum": 17,
    "title": "휴가 때 제주도에 다녀올 거예요",
    "titleEng": "During Vacation, I Will Visit Jeju Island",
    "category": "여행과 휴가",
    "categoryColor": "#ec4899",
    "goal": "휴가 계획을 세우고 여행 경험을 이야기할 수 있다.",
    "grammar": [
      {
        "name": "-아/어 보다",
        "summary": "휴가 때 제주도에 다녀올 거예요 핵심 문법",
        "details": "단원 17과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 보다 완료해야 합니다.",
          "반장님과 함께 -아/어 보다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ 거예요",
        "summary": "휴가 때 제주도에 다녀올 거예요 핵심 문법",
        "details": "단원 17과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 거예요 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 거예요 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "여행지",
        "meaning": "Standard term for 여행지",
        "pron": "korean-pron",
        "example": "여행지 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "숙소(펜션/호텔/콘도)",
        "meaning": "Standard term for 숙소(펜션/호텔/콘도)",
        "pron": "korean-pron",
        "example": "숙소(펜션/호텔/콘도) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "예약",
        "meaning": "Standard term for 예약",
        "pron": "korean-pron",
        "example": "예약 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 휴가 때 제주도에 다녀올 거예요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 휴가 때 제주도에 다녀올 거예요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '휴가 때 제주도에 다녀올 거예요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 여행지 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 여행지 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제17과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제17과 '휴가 때 제주도에 다녀올 거예요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "휴가 계획을 세우고 여행 경험을 이야기할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제17과의 핵심 목표는 '휴가 계획을 세우고 여행 경험을 이야기할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제17과의 핵심 문법 '-아/어 보다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '여행지'의 의미로 가장 알맞은 것은?",
        "options": [
          "제17과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제17과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 18,
    "book": 1,
    "lessonNum": 18,
    "title": "버스나 지하철을 타고 가요",
    "titleEng": "I Go by Bus or Subway (Transportation)",
    "category": "교통 이용",
    "categoryColor": "#3b82f6",
    "goal": "대중교통 이용법과 이동 소요 시간을 설명할 수 있다.",
    "grammar": [
      {
        "name": "(이)나",
        "summary": "버스나 지하철을 타고 가요 핵심 문법",
        "details": "단원 18과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 (이)나 완료해야 합니다.",
          "반장님과 함께 (이)나 상의하세요."
        ]
      },
      {
        "name": "에서 ~ 까지",
        "summary": "버스나 지하철을 타고 가요 핵심 문법",
        "details": "단원 18과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 에서 ~ 까지 완료해야 합니다.",
          "반장님과 함께 에서 ~ 까지 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "버스",
        "meaning": "Standard term for 버스",
        "pron": "korean-pron",
        "example": "버스 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "지하철",
        "meaning": "Standard term for 지하철",
        "pron": "korean-pron",
        "example": "지하철 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "택시",
        "meaning": "Standard term for 택시",
        "pron": "korean-pron",
        "example": "택시 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "교통카드 충전",
        "meaning": "Standard term for 교통카드 충전",
        "pron": "korean-pron",
        "example": "교통카드 충전 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 버스나 지하철을 타고 가요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 버스나 지하철을 타고 가요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '버스나 지하철을 타고 가요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 버스 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 버스 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제18과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제18과 '버스나 지하철을 타고 가요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "대중교통 이용법과 이동 소요 시간을 설명할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제18과의 핵심 목표는 '대중교통 이용법과 이동 소요 시간을 설명할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제18과의 핵심 문법 '(이)나'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '버스'의 의미로 가장 알맞은 것은?",
        "options": [
          "제18과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제18과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 19,
    "book": 1,
    "lessonNum": 19,
    "title": "거기 인도네시아 식당이지요?",
    "titleEng": "Is That the Indonesian Restaurant?",
    "category": "전화와 통신",
    "categoryColor": "#f59e0b",
    "goal": "전화 통화 예절을 지키고 정보를 확인할 수 있다.",
    "grammar": [
      {
        "name": "-지요?",
        "summary": "거기 인도네시아 식당이지요? 핵심 문법",
        "details": "단원 19과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -지요? 완료해야 합니다.",
          "반장님과 함께 -지요? 상의하세요."
        ]
      },
      {
        "name": "-고",
        "summary": "거기 인도네시아 식당이지요? 핵심 문법",
        "details": "단원 19과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -고 완료해야 합니다.",
          "반장님과 함께 -고 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "전화 걸기",
        "meaning": "Standard term for 전화 걸기",
        "pron": "korean-pron",
        "example": "전화 걸기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "문자 메시지",
        "meaning": "Standard term for 문자 메시지",
        "pron": "korean-pron",
        "example": "문자 메시지 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "인터넷 검색",
        "meaning": "Standard term for 인터넷 검색",
        "pron": "korean-pron",
        "example": "인터넷 검색 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 거기 인도네시아 식당이지요? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 거기 인도네시아 식당이지요? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '거기 인도네시아 식당이지요?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 전화 걸기 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 전화 걸기 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제19과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제19과 '거기 인도네시아 식당이지요?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "전화 통화 예절을 지키고 정보를 확인할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제19과의 핵심 목표는 '전화 통화 예절을 지키고 정보를 확인할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제19과의 핵심 문법 '-지요?'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '전화 걸기'의 의미로 가장 알맞은 것은?",
        "options": [
          "제19과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제19과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 20,
    "book": 1,
    "lessonNum": 20,
    "title": "저는 설거지를 할게요",
    "titleEng": "I Will Do the Dishes (Housework & Chores)",
    "category": "집안일 분담",
    "categoryColor": "#10b981",
    "goal": "기숙사와 집안일을 공평하게 분담할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄹ게요",
        "summary": "저는 설거지를 할게요 핵심 문법",
        "details": "단원 20과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ게요 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ게요 상의하세요."
        ]
      },
      {
        "name": "-는 것",
        "summary": "저는 설거지를 할게요 핵심 문법",
        "details": "단원 20과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는 것 완료해야 합니다.",
          "반장님과 함께 -는 것 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "청소기 돌리기",
        "meaning": "Standard term for 청소기 돌리기",
        "pron": "korean-pron",
        "example": "청소기 돌리기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "빨래 널기",
        "meaning": "Standard term for 빨래 널기",
        "pron": "korean-pron",
        "example": "빨래 널기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "분리수거",
        "meaning": "Standard term for 분리수거",
        "pron": "korean-pron",
        "example": "분리수거 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 저는 설거지를 할게요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 저는 설거지를 할게요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '저는 설거지를 할게요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 청소기 돌리기 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 청소기 돌리기 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제20과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제20과 '저는 설거지를 할게요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "기숙사와 집안일을 공평하게 분담할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제20과의 핵심 목표는 '기숙사와 집안일을 공평하게 분담할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제20과의 핵심 문법 '-(으)ㄹ게요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '청소기 돌리기'의 의미로 가장 알맞은 것은?",
        "options": [
          "제20과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제20과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 21,
    "book": 1,
    "lessonNum": 21,
    "title": "상 차리는 것을 도와줄까요?",
    "titleEng": "Shall I Help You Set the Table? (Invitations)",
    "category": "초대와 방문",
    "categoryColor": "#8b5cf6",
    "goal": "초대받았을 때 예절과 음식 상차림을 도울 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄹ까요?",
        "summary": "상 차리는 것을 도와줄까요? 핵심 문법",
        "details": "단원 21과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ까요? 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ까요? 상의하세요."
        ]
      },
      {
        "name": "-(으)려고",
        "summary": "상 차리는 것을 도와줄까요? 핵심 문법",
        "details": "단원 21과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)려고 완료해야 합니다.",
          "반장님과 함께 -(으)려고 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "집들이",
        "meaning": "Standard term for 집들이",
        "pron": "korean-pron",
        "example": "집들이 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "선물(세제/휴지)",
        "meaning": "Standard term for 선물(세제/휴지)",
        "pron": "korean-pron",
        "example": "선물(세제/휴지) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "초대",
        "meaning": "Standard term for 초대",
        "pron": "korean-pron",
        "example": "초대 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 상 차리는 것을 도와줄까요? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 상 차리는 것을 도와줄까요? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '상 차리는 것을 도와줄까요?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 집들이 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 집들이 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제21과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제21과 '상 차리는 것을 도와줄까요?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "초대받았을 때 예절과 음식 상차림을 도울 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제21과의 핵심 목표는 '초대받았을 때 예절과 음식 상차림을 도울 수 있다.'입니다."
      },
      {
        "q": "다음 중 제21과의 핵심 문법 '-(으)ㄹ까요?'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '집들이'의 의미로 가장 알맞은 것은?",
        "options": [
          "제21과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제21과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 22,
    "book": 1,
    "lessonNum": 22,
    "title": "무단횡단을 하면 안 돼요",
    "titleEng": "You Must Not Jaywalk (Public Rules)",
    "category": "공공 규칙",
    "categoryColor": "#ef4444",
    "goal": "공공장소 금지 사항과 준수 규범을 이해할 수 있다.",
    "grammar": [
      {
        "name": "-(으)면 안 되다",
        "summary": "무단횡단을 하면 안 돼요 핵심 문법",
        "details": "단원 22과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면 안 되다 완료해야 합니다.",
          "반장님과 함께 -(으)면 안 되다 상의하세요."
        ]
      },
      {
        "name": "-(으)니까",
        "summary": "무단횡단을 하면 안 돼요 핵심 문법",
        "details": "단원 22과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)니까 완료해야 합니다.",
          "반장님과 함께 -(으)니까 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "횡단보도",
        "meaning": "Standard term for 횡단보도",
        "pron": "korean-pron",
        "example": "횡단보도 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "금연구역",
        "meaning": "Standard term for 금연구역",
        "pron": "korean-pron",
        "example": "금연구역 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "노약자석",
        "meaning": "Standard term for 노약자석",
        "pron": "korean-pron",
        "example": "노약자석 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "벌금",
        "meaning": "Standard term for 벌금",
        "pron": "korean-pron",
        "example": "벌금 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 무단횡단을 하면 안 돼요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 무단횡단을 하면 안 돼요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '무단횡단을 하면 안 돼요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 횡단보도 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 횡단보도 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제22과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제22과 '무단횡단을 하면 안 돼요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "공공장소 금지 사항과 준수 규범을 이해할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제22과의 핵심 목표는 '공공장소 금지 사항과 준수 규범을 이해할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제22과의 핵심 문법 '-(으)면 안 되다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '횡단보도'의 의미로 가장 알맞은 것은?",
        "options": [
          "제22과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제22과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 23,
    "book": 1,
    "lessonNum": 23,
    "title": "어르신께는 두 손으로 물건을 드려야 해요",
    "titleEng": "You Must Hand Items to Elders with Two Hands",
    "category": "한국 예절",
    "categoryColor": "#f59e0b",
    "goal": "한국의 연령별 예절과 높임법을 바르게 사용할 수 있다.",
    "grammar": [
      {
        "name": "-(으)시- (높임)",
        "summary": "어르신께는 두 손으로 물건을 드려야 해요 핵심 문법",
        "details": "단원 23과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)시- (높임) 완료해야 합니다.",
          "반장님과 함께 -(으)시- (높임) 상의하세요."
        ]
      },
      {
        "name": "-아/어야 하다",
        "summary": "어르신께는 두 손으로 물건을 드려야 해요 핵심 문법",
        "details": "단원 23과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어야 하다 완료해야 합니다.",
          "반장님과 함께 -아/어야 하다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "존댓말",
        "meaning": "Standard term for 존댓말",
        "pron": "korean-pron",
        "example": "존댓말 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "두 손 드리기",
        "meaning": "Standard term for 두 손 드리기",
        "pron": "korean-pron",
        "example": "두 손 드리기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "고개 돌려 마시기",
        "meaning": "Standard term for 고개 돌려 마시기",
        "pron": "korean-pron",
        "example": "고개 돌려 마시기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 어르신께는 두 손으로 물건을 드려야 해요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 어르신께는 두 손으로 물건을 드려야 해요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '어르신께는 두 손으로 물건을 드려야 해요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 존댓말 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 존댓말 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제23과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제23과 '어르신께는 두 손으로 물건을 드려야 해요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "한국의 연령별 예절과 높임법을 바르게 사용할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제23과의 핵심 목표는 '한국의 연령별 예절과 높임법을 바르게 사용할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제23과의 핵심 문법 '-(으)시- (높임)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '존댓말'의 의미로 가장 알맞은 것은?",
        "options": [
          "제23과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제23과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 24,
    "book": 1,
    "lessonNum": 24,
    "title": "한국 영화를 보면서 공부해요",
    "titleEng": "I Study While Watching Korean Movies",
    "category": "학습과 교육",
    "categoryColor": "#06b6d4",
    "goal": "한국어 학습 방법과 교육 수강 신청을 할 수 있다.",
    "grammar": [
      {
        "name": "-(으)면서",
        "summary": "한국 영화를 보면서 공부해요 핵심 문법",
        "details": "단원 24과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면서 완료해야 합니다.",
          "반장님과 함께 -(으)면서 상의하세요."
        ]
      },
      {
        "name": "-(으)면",
        "summary": "한국 영화를 보면서 공부해요 핵심 문법",
        "details": "단원 24과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면 완료해야 합니다.",
          "반장님과 함께 -(으)면 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "외국인력센터 강좌",
        "meaning": "Standard term for 외국인력센터 강좌",
        "pron": "korean-pron",
        "example": "외국인력센터 강좌 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "자격증",
        "meaning": "Standard term for 자격증",
        "pron": "korean-pron",
        "example": "자격증 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "복습",
        "meaning": "Standard term for 복습",
        "pron": "korean-pron",
        "example": "복습 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 한국 영화를 보면서 공부해요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 한국 영화를 보면서 공부해요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '한국 영화를 보면서 공부해요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 외국인력센터 강좌 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 외국인력센터 강좌 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제24과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제24과 '한국 영화를 보면서 공부해요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "한국어 학습 방법과 교육 수강 신청을 할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제24과의 핵심 목표는 '한국어 학습 방법과 교육 수강 신청을 할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제24과의 핵심 문법 '-(으)면서'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '외국인력센터 강좌'의 의미로 가장 알맞은 것은?",
        "options": [
          "제24과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제24과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 25,
    "book": 1,
    "lessonNum": 25,
    "title": "일요일마다 교회에 가요",
    "titleEng": "I Go to Church Every Sunday (Religions)",
    "category": "종교와 생활",
    "categoryColor": "#8b5cf6",
    "goal": "자신의 종교 생활을 표현하고 타 문화를 존중할 수 있다.",
    "grammar": [
      {
        "name": "-마다",
        "summary": "일요일마다 교회에 가요 핵심 문법",
        "details": "단원 25과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -마다 완료해야 합니다.",
          "반장님과 함께 -마다 상의하세요."
        ]
      },
      {
        "name": "-기 전에",
        "summary": "일요일마다 교회에 가요 핵심 문법",
        "details": "단원 25과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 전에 완료해야 합니다.",
          "반장님과 함께 -기 전에 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "교회",
        "meaning": "Standard term for 교회",
        "pron": "korean-pron",
        "example": "교회 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "성당",
        "meaning": "Standard term for 성당",
        "pron": "korean-pron",
        "example": "성당 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "절(사찰)",
        "meaning": "Standard term for 절(사찰)",
        "pron": "korean-pron",
        "example": "절(사찰) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "이슬람 사원",
        "meaning": "Standard term for 이슬람 사원",
        "pron": "korean-pron",
        "example": "이슬람 사원 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 일요일마다 교회에 가요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 일요일마다 교회에 가요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '일요일마다 교회에 가요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 교회 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 교회 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제25과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제25과 '일요일마다 교회에 가요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "자신의 종교 생활을 표현하고 타 문화를 존중할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제25과의 핵심 목표는 '자신의 종교 생활을 표현하고 타 문화를 존중할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제25과의 핵심 문법 '-마다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '교회'의 의미로 가장 알맞은 것은?",
        "options": [
          "제25과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제25과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 26,
    "book": 1,
    "lessonNum": 26,
    "title": "밥을 먹은 후에 이 약을 드세요",
    "titleEng": "Take This Medicine After Meals (Health & Clinic)",
    "category": "건강과 약국",
    "categoryColor": "#10b981",
    "goal": "몸의 증상을 약사에게 설명하고 복약 지도를 이해할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ 후에",
        "summary": "밥을 먹은 후에 이 약을 드세요 핵심 문법",
        "details": "단원 26과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 후에 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 후에 상의하세요."
        ]
      },
      {
        "name": "-지 마세요",
        "summary": "밥을 먹은 후에 이 약을 드세요 핵심 문법",
        "details": "단원 26과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -지 마세요 완료해야 합니다.",
          "반장님과 함께 -지 마세요 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "감기약",
        "meaning": "Standard term for 감기약",
        "pron": "korean-pron",
        "example": "감기약 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "소화제",
        "meaning": "Standard term for 소화제",
        "pron": "korean-pron",
        "example": "소화제 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "붕대",
        "meaning": "Standard term for 붕대",
        "pron": "korean-pron",
        "example": "붕대 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "복용법(식후 30분)",
        "meaning": "Standard term for 복용법(식후 30분)",
        "pron": "korean-pron",
        "example": "복용법(식후 30분) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 밥을 먹은 후에 이 약을 드세요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 밥을 먹은 후에 이 약을 드세요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '밥을 먹은 후에 이 약을 드세요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 감기약 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 감기약 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제26과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제26과 '밥을 먹은 후에 이 약을 드세요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "몸의 증상을 약사에게 설명하고 복약 지도를 이해할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제26과의 핵심 목표는 '몸의 증상을 약사에게 설명하고 복약 지도를 이해할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제26과의 핵심 문법 '-(으)ㄴ 후에'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '감기약'의 의미로 가장 알맞은 것은?",
        "options": [
          "제26과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제26과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 27,
    "book": 1,
    "lessonNum": 27,
    "title": "어디가 아프십니까?",
    "titleEng": "Where Does It Hurt? (Hospitals & Medical Care)",
    "category": "병원 진료",
    "categoryColor": "#ef4444",
    "goal": "병원 진료 접수 및 통증 부위를 명확히 진술할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㅂ니까?",
        "summary": "어디가 아프십니까? 핵심 문법",
        "details": "단원 27과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㅂ니까? 완료해야 합니다.",
          "반장님과 함께 -(으)ㅂ니까? 상의하세요."
        ]
      },
      {
        "name": "-(으)면",
        "summary": "어디가 아프십니까? 핵심 문법",
        "details": "단원 27과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면 완료해야 합니다.",
          "반장님과 함께 -(으)면 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "내과",
        "meaning": "Standard term for 내과",
        "pron": "korean-pron",
        "example": "내과 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "정형외과",
        "meaning": "Standard term for 정형외과",
        "pron": "korean-pron",
        "example": "정형외과 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "이비인후과",
        "meaning": "Standard term for 이비인후과",
        "pron": "korean-pron",
        "example": "이비인후과 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "치과",
        "meaning": "Standard term for 치과",
        "pron": "korean-pron",
        "example": "치과 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "처방전",
        "meaning": "Standard term for 처방전",
        "pron": "korean-pron",
        "example": "처방전 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 어디가 아프십니까? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 어디가 아프십니까? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '어디가 아프십니까?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 내과 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 내과 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제27과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제27과 '어디가 아프십니까?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "병원 진료 접수 및 통증 부위를 명확히 진술할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제27과의 핵심 목표는 '병원 진료 접수 및 통증 부위를 명확히 진술할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제27과의 핵심 문법 '-(으)ㅂ니까?'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '내과'의 의미로 가장 알맞은 것은?",
        "options": [
          "제27과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제27과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 28,
    "book": 1,
    "lessonNum": 28,
    "title": "통장을 만들려고 왔어요",
    "titleEng": "I Came to Open a Bank Account (Banking)",
    "category": "은행 업무",
    "categoryColor": "#3b82f6",
    "goal": "은행 창구에서 계좌 개설과 송금을 신청할 수 있다.",
    "grammar": [
      {
        "name": "-(으)려고",
        "summary": "통장을 만들려고 왔어요 핵심 문법",
        "details": "단원 28과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)려고 완료해야 합니다.",
          "반장님과 함께 -(으)려고 상의하세요."
        ]
      },
      {
        "name": "-(으)면 되다",
        "summary": "통장을 만들려고 왔어요 핵심 문법",
        "details": "단원 28과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면 되다 완료해야 합니다.",
          "반장님과 함께 -(으)면 되다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "통장 개설",
        "meaning": "Standard term for 통장 개설",
        "pron": "korean-pron",
        "example": "통장 개설 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "신분증",
        "meaning": "Standard term for 신분증",
        "pron": "korean-pron",
        "example": "신분증 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "체크카드",
        "meaning": "Standard term for 체크카드",
        "pron": "korean-pron",
        "example": "체크카드 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "해외 송금",
        "meaning": "Standard term for 해외 송금",
        "pron": "korean-pron",
        "example": "해외 송금 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 통장을 만들려고 왔어요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 통장을 만들려고 왔어요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '통장을 만들려고 왔어요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 통장 개설 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 통장 개설 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제28과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제28과 '통장을 만들려고 왔어요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "은행 창구에서 계좌 개설과 송금을 신청할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제28과의 핵심 목표는 '은행 창구에서 계좌 개설과 송금을 신청할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제28과의 핵심 문법 '-(으)려고'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '통장 개설'의 의미로 가장 알맞은 것은?",
        "options": [
          "제28과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제28과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 29,
    "book": 1,
    "lessonNum": 29,
    "title": "필리핀으로 엽서를 보내고 싶은데요",
    "titleEng": "I Want to Send a Postcard to the Philippines",
    "category": "우체국 이용",
    "categoryColor": "#06b6d4",
    "goal": "우체국에서 국제 우편과 택배를 접수할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ/는데요",
        "summary": "필리핀으로 엽서를 보내고 싶은데요 핵심 문법",
        "details": "단원 29과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ/는데요 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ/는데요 상의하세요."
        ]
      },
      {
        "name": "-(으)로",
        "summary": "필리핀으로 엽서를 보내고 싶은데요 핵심 문법",
        "details": "단원 29과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)로 완료해야 합니다.",
          "반장님과 함께 -(으)로 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "국제특송(EMS)",
        "meaning": "Standard term for 국제특송(EMS)",
        "pron": "korean-pron",
        "example": "국제특송(EMS) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "택배 박스",
        "meaning": "Standard term for 택배 박스",
        "pron": "korean-pron",
        "example": "택배 박스 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "저울",
        "meaning": "Standard term for 저울",
        "pron": "korean-pron",
        "example": "저울 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "우편번호",
        "meaning": "Standard term for 우편번호",
        "pron": "korean-pron",
        "example": "우편번호 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 필리핀으로 엽서를 보내고 싶은데요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 필리핀으로 엽서를 보내고 싶은데요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '필리핀으로 엽서를 보내고 싶은데요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 국제특송(EMS) 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 국제특송(EMS) ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제29과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제29과 '필리핀으로 엽서를 보내고 싶은데요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "우체국에서 국제 우편과 택배를 접수할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제29과의 핵심 목표는 '우체국에서 국제 우편과 택배를 접수할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제29과의 핵심 문법 '-(으)ㄴ/는데요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '국제특송(EMS)'의 의미로 가장 알맞은 것은?",
        "options": [
          "제29과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제29과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 30,
    "book": 1,
    "lessonNum": 30,
    "title": "거기서 태권도를 배울 수 있어요?",
    "titleEng": "Can I Learn Taekwondo There? (Support Center)",
    "category": "외국인 지원",
    "categoryColor": "#8b5cf6",
    "goal": "다양한 지원 기관의 무료 복지 프로그램을 신청할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄹ 수 있다",
        "summary": "거기서 태권도를 배울 수 있어요? 핵심 문법",
        "details": "단원 30과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 수 있다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 수 있다 상의하세요."
        ]
      },
      {
        "name": "-(으)려면",
        "summary": "거기서 태권도를 배울 수 있어요? 핵심 문법",
        "details": "단원 30과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)려면 완료해야 합니다.",
          "반장님과 함께 -(으)려면 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "외국인근로자지원센터",
        "meaning": "Standard term for 외국인근로자지원센터",
        "pron": "korean-pron",
        "example": "외국인근로자지원센터 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "무료 진료",
        "meaning": "Standard term for 무료 진료",
        "pron": "korean-pron",
        "example": "무료 진료 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "법률 상담",
        "meaning": "Standard term for 법률 상담",
        "pron": "korean-pron",
        "example": "법률 상담 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 거기서 태권도를 배울 수 있어요? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 거기서 태권도를 배울 수 있어요? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '거기서 태권도를 배울 수 있어요?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 외국인근로자지원센터 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 외국인근로자지원센터 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제30과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제30과 '거기서 태권도를 배울 수 있어요?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "다양한 지원 기관의 무료 복지 프로그램을 신청할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제30과의 핵심 목표는 '다양한 지원 기관의 무료 복지 프로그램을 신청할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제30과의 핵심 문법 '-(으)ㄹ 수 있다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '외국인근로자지원센터'의 의미로 가장 알맞은 것은?",
        "options": [
          "제30과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제30과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 31,
    "book": 2,
    "lessonNum": 31,
    "title": "우리 고향은 서울보다 공기가 맑아요",
    "titleEng": "My Hometown Has Cleaner Air Than Seoul",
    "category": "고향과 기후",
    "categoryColor": "#06b6d4",
    "goal": "고향의 특징과 한국 도시의 환경을 비교할 수 있다.",
    "grammar": [
      {
        "name": "-보다 (비교)",
        "summary": "우리 고향은 서울보다 공기가 맑아요 핵심 문법",
        "details": "단원 31과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -보다 (비교) 완료해야 합니다.",
          "반장님과 함께 -보다 (비교) 상의하세요."
        ]
      },
      {
        "name": "제일·가장",
        "summary": "우리 고향은 서울보다 공기가 맑아요 핵심 문법",
        "details": "단원 31과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 제일·가장 완료해야 합니다.",
          "반장님과 함께 제일·가장 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "인구",
        "meaning": "Standard term for 인구",
        "pron": "korean-pron",
        "example": "인구 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "공기",
        "meaning": "Standard term for 공기",
        "pron": "korean-pron",
        "example": "공기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "기온",
        "meaning": "Standard term for 기온",
        "pron": "korean-pron",
        "example": "기온 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "습도",
        "meaning": "Standard term for 습도",
        "pron": "korean-pron",
        "example": "습도 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "도시 비교",
        "meaning": "Standard term for 도시 비교",
        "pron": "korean-pron",
        "example": "도시 비교 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 우리 고향은 서울보다 공기가 맑아요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 우리 고향은 서울보다 공기가 맑아요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '우리 고향은 서울보다 공기가 맑아요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 인구 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 인구 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제31과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제31과 '우리 고향은 서울보다 공기가 맑아요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "고향의 특징과 한국 도시의 환경을 비교할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제31과의 핵심 목표는 '고향의 특징과 한국 도시의 환경을 비교할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제31과의 핵심 문법 '-보다 (비교)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '인구'의 의미로 가장 알맞은 것은?",
        "options": [
          "제31과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제31과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 32,
    "book": 2,
    "lessonNum": 32,
    "title": "복날에는 삼계탕을 먹어요",
    "titleEng": "We Eat Samgyetang on Boknal (Seasonal Food)",
    "category": "한국 음식 문화",
    "categoryColor": "#f59e0b",
    "goal": "계절별 한국 특별 음식의 유래와 의미를 설명할 수 있다.",
    "grammar": [
      {
        "name": "-는 동안",
        "summary": "복날에는 삼계탕을 먹어요 핵심 문법",
        "details": "단원 32과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는 동안 완료해야 합니다.",
          "반장님과 함께 -는 동안 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄴ 것 같다",
        "summary": "복날에는 삼계탕을 먹어요 핵심 문법",
        "details": "단원 32과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 것 같다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 것 같다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "초복/중복/말복",
        "meaning": "Standard term for 초복/중복/말복",
        "pron": "korean-pron",
        "example": "초복/중복/말복 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "떡국",
        "meaning": "Standard term for 떡국",
        "pron": "korean-pron",
        "example": "떡국 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "송편",
        "meaning": "Standard term for 송편",
        "pron": "korean-pron",
        "example": "송편 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "보양식",
        "meaning": "Standard term for 보양식",
        "pron": "korean-pron",
        "example": "보양식 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 복날에는 삼계탕을 먹어요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 복날에는 삼계탕을 먹어요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '복날에는 삼계탕을 먹어요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 초복/중복/말복 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 초복/중복/말복 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제32과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제32과 '복날에는 삼계탕을 먹어요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "계절별 한국 특별 음식의 유래와 의미를 설명할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제32과의 핵심 목표는 '계절별 한국 특별 음식의 유래와 의미를 설명할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제32과의 핵심 문법 '-는 동안'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '초복/중복/말복'의 의미로 가장 알맞은 것은?",
        "options": [
          "제32과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제32과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 33,
    "book": 2,
    "lessonNum": 33,
    "title": "송편을 만드는 체험도 할 수 있어요",
    "titleEng": "You Can Experience Making Songpyeon (Holidays)",
    "category": "명절과 세시풍속",
    "categoryColor": "#10b981",
    "goal": "한국의 2대 명절 문화와 전통 놀이를 체험할 수 있다.",
    "grammar": [
      {
        "name": "-겠- (추측/의지)",
        "summary": "송편을 만드는 체험도 할 수 있어요 핵심 문법",
        "details": "단원 33과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -겠- (추측/의지) 완료해야 합니다.",
          "반장님과 함께 -겠- (추측/의지) 상의하세요."
        ]
      },
      {
        "name": "-아/어 보다",
        "summary": "송편을 만드는 체험도 할 수 있어요 핵심 문법",
        "details": "단원 33과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 보다 완료해야 합니다.",
          "반장님과 함께 -아/어 보다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "설날",
        "meaning": "Standard term for 설날",
        "pron": "korean-pron",
        "example": "설날 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "추석",
        "meaning": "Standard term for 추석",
        "pron": "korean-pron",
        "example": "추석 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "세배",
        "meaning": "Standard term for 세배",
        "pron": "korean-pron",
        "example": "세배 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "한복 입기",
        "meaning": "Standard term for 한복 입기",
        "pron": "korean-pron",
        "example": "한복 입기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "귀성길",
        "meaning": "Standard term for 귀성길",
        "pron": "korean-pron",
        "example": "귀성길 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 송편을 만드는 체험도 할 수 있어요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 송편을 만드는 체험도 할 수 있어요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '송편을 만드는 체험도 할 수 있어요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 설날 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 설날 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제33과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제33과 '송편을 만드는 체험도 할 수 있어요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "한국의 2대 명절 문화와 전통 놀이를 체험할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제33과의 핵심 목표는 '한국의 2대 명절 문화와 전통 놀이를 체험할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제33과의 핵심 문법 '-겠- (추측/의지)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '설날'의 의미로 가장 알맞은 것은?",
        "options": [
          "제33과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제33과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 34,
    "book": 2,
    "lessonNum": 34,
    "title": "아기 옷을 선물하는 게 어때요?",
    "titleEng": "How About Gifting Baby Clothes? (Special Days)",
    "category": "가족 행사와 선물",
    "categoryColor": "#ec4899",
    "goal": "한국의 경조사 예절과 상황별 적절한 선물을 준비할 수 있다.",
    "grammar": [
      {
        "name": "-는 게 어때요?",
        "summary": "아기 옷을 선물하는 게 어때요? 핵심 문법",
        "details": "단원 34과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는 게 어때요? 완료해야 합니다.",
          "반장님과 함께 -는 게 어때요? 상의하세요."
        ]
      },
      {
        "name": "-기 때문에",
        "summary": "아기 옷을 선물하는 게 어때요? 핵심 문법",
        "details": "단원 34과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 때문에 완료해야 합니다.",
          "반장님과 함께 -기 때문에 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "돌잔치",
        "meaning": "Standard term for 돌잔치",
        "pron": "korean-pron",
        "example": "돌잔치 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "결혼식",
        "meaning": "Standard term for 결혼식",
        "pron": "korean-pron",
        "example": "결혼식 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "조의금(부의금)",
        "meaning": "Standard term for 조의금(부의금)",
        "pron": "korean-pron",
        "example": "조의금(부의금) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "축의금",
        "meaning": "Standard term for 축의금",
        "pron": "korean-pron",
        "example": "축의금 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 아기 옷을 선물하는 게 어때요? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 아기 옷을 선물하는 게 어때요? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '아기 옷을 선물하는 게 어때요?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 돌잔치 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 돌잔치 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제34과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제34과 '아기 옷을 선물하는 게 어때요?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "한국의 경조사 예절과 상황별 적절한 선물을 준비할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제34과의 핵심 목표는 '한국의 경조사 예절과 상황별 적절한 선물을 준비할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제34과의 핵심 문법 '-는 게 어때요?'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '돌잔치'의 의미로 가장 알맞은 것은?",
        "options": [
          "제34과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제34과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 35,
    "book": 2,
    "lessonNum": 35,
    "title": "한국 드라마가 재미있잖아요",
    "titleEng": "Korean Dramas Are Fun, You Know (Hallyu & Industry)",
    "category": "한류와 문화",
    "categoryColor": "#8b5cf6",
    "goal": "한류 콘텐츠와 한국 주요 수출 산업에 대해 대화할 수 있다.",
    "grammar": [
      {
        "name": "-잖아요",
        "summary": "한국 드라마가 재미있잖아요 핵심 문법",
        "details": "단원 35과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -잖아요 완료해야 합니다.",
          "반장님과 함께 -잖아요 상의하세요."
        ]
      },
      {
        "name": "-는 편이다",
        "summary": "한국 드라마가 재미있잖아요 핵심 문법",
        "details": "단원 35과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는 편이다 완료해야 합니다.",
          "반장님과 함께 -는 편이다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "K-POP",
        "meaning": "Standard term for K-POP",
        "pron": "korean-pron",
        "example": "K-POP 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "K-드라마",
        "meaning": "Standard term for K-드라마",
        "pron": "korean-pron",
        "example": "K-드라마 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "전자제품",
        "meaning": "Standard term for 전자제품",
        "pron": "korean-pron",
        "example": "전자제품 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "자동차",
        "meaning": "Standard term for 자동차",
        "pron": "korean-pron",
        "example": "자동차 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 한국 드라마가 재미있잖아요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 한국 드라마가 재미있잖아요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '한국 드라마가 재미있잖아요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 K-POP 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for K-POP ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제35과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제35과 '한국 드라마가 재미있잖아요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "한류 콘텐츠와 한국 주요 수출 산업에 대해 대화할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제35과의 핵심 목표는 '한류 콘텐츠와 한국 주요 수출 산업에 대해 대화할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제35과의 핵심 문법 '-잖아요'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 'K-POP'의 의미로 가장 알맞은 것은?",
        "options": [
          "제35과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제35과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 36,
    "book": 2,
    "lessonNum": 36,
    "title": "단정한 모습이 좋아 보여요",
    "titleEng": "A Neat Appearance Looks Good (Workplace Dress)",
    "category": "직장 복장 규정",
    "categoryColor": "#3b82f6",
    "goal": "현장 안전과 위생을 위한 작업복 착용 수칙을 지킬 수 있다.",
    "grammar": [
      {
        "name": "-아/어 보이다",
        "summary": "단정한 모습이 좋아 보여요 핵심 문법",
        "details": "단원 36과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 보이다 완료해야 합니다.",
          "반장님과 함께 -아/어 보이다 상의하세요."
        ]
      },
      {
        "name": "-게",
        "summary": "단정한 모습이 좋아 보여요 핵심 문법",
        "details": "단원 36과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -게 완료해야 합니다.",
          "반장님과 함께 -게 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "작업복",
        "meaning": "Standard term for 작업복",
        "pron": "korean-pron",
        "example": "작업복 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "안전모",
        "meaning": "Standard term for 안전모",
        "pron": "korean-pron",
        "example": "안전모 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "단추 채우기",
        "meaning": "Standard term for 단추 채우기",
        "pron": "korean-pron",
        "example": "단추 채우기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "지퍼 올리기",
        "meaning": "Standard term for 지퍼 올리기",
        "pron": "korean-pron",
        "example": "지퍼 올리기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 단정한 모습이 좋아 보여요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 단정한 모습이 좋아 보여요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '단정한 모습이 좋아 보여요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 작업복 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 작업복 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제36과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제36과 '단정한 모습이 좋아 보여요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "현장 안전과 위생을 위한 작업복 착용 수칙을 지킬 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제36과의 핵심 목표는 '현장 안전과 위생을 위한 작업복 착용 수칙을 지킬 수 있다.'입니다."
      },
      {
        "q": "다음 중 제36과의 핵심 문법 '-아/어 보이다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '작업복'의 의미로 가장 알맞은 것은?",
        "options": [
          "제36과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제36과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 37,
    "book": 2,
    "lessonNum": 37,
    "title": "출입문을 꼭 닫읍시다",
    "titleEng": "Let's Make Sure to Close the Entrance Door",
    "category": "기숙사 공동생활",
    "categoryColor": "#10b981",
    "goal": "기숙사 규칙을 준수하고 쾌적한 주거를 유지할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㅂ시다 (권유)",
        "summary": "출입문을 꼭 닫읍시다 핵심 문법",
        "details": "단원 37과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㅂ시다 (권유) 완료해야 합니다.",
          "반장님과 함께 -(으)ㅂ시다 (권유) 상의하세요."
        ]
      },
      {
        "name": "-(으)면서",
        "summary": "출입문을 꼭 닫읍시다 핵심 문법",
        "details": "단원 37과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면서 완료해야 합니다.",
          "반장님과 함께 -(으)면서 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "난방 조절",
        "meaning": "Standard term for 난방 조절",
        "pron": "korean-pron",
        "example": "난방 조절 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "소음 주의",
        "meaning": "Standard term for 소음 주의",
        "pron": "korean-pron",
        "example": "소음 주의 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "전열기구 단속",
        "meaning": "Standard term for 전열기구 단속",
        "pron": "korean-pron",
        "example": "전열기구 단속 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 출입문을 꼭 닫읍시다 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 출입문을 꼭 닫읍시다 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '출입문을 꼭 닫읍시다' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 난방 조절 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 난방 조절 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제37과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제37과 '출입문을 꼭 닫읍시다'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "기숙사 규칙을 준수하고 쾌적한 주거를 유지할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제37과의 핵심 목표는 '기숙사 규칙을 준수하고 쾌적한 주거를 유지할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제37과의 핵심 문법 '-(으)ㅂ시다 (권유)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '난방 조절'의 의미로 가장 알맞은 것은?",
        "options": [
          "제37과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제37과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 38,
    "book": 2,
    "lessonNum": 38,
    "title": "일할 맛이 나요",
    "titleEng": "It Feels Rewarding to Work (Teamwork)",
    "category": "직장 내 인간관계",
    "categoryColor": "#f59e0b",
    "goal": "동료와의 갈등을 예방하고 화목한 팀워크를 형성할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ 덕분에",
        "summary": "일할 맛이 나요 핵심 문법",
        "details": "단원 38과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 덕분에 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 덕분에 상의하세요."
        ]
      },
      {
        "name": "-기 마련이다",
        "summary": "일할 맛이 나요 핵심 문법",
        "details": "단원 38과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 마련이다 완료해야 합니다.",
          "반장님과 함께 -기 마련이다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "분위기 좋다",
        "meaning": "Standard term for 분위기 좋다",
        "pron": "korean-pron",
        "example": "분위기 좋다 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "서로 돕다",
        "meaning": "Standard term for 서로 돕다",
        "pron": "korean-pron",
        "example": "서로 돕다 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "격려하다",
        "meaning": "Standard term for 격려하다",
        "pron": "korean-pron",
        "example": "격려하다 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "보람",
        "meaning": "Standard term for 보람",
        "pron": "korean-pron",
        "example": "보람 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 일할 맛이 나요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 일할 맛이 나요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '일할 맛이 나요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 분위기 좋다 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 분위기 좋다 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제38과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제38과 '일할 맛이 나요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "동료와의 갈등을 예방하고 화목한 팀워크를 형성할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제38과의 핵심 목표는 '동료와의 갈등을 예방하고 화목한 팀워크를 형성할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제38과의 핵심 문법 '-(으)ㄴ 덕분에'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '분위기 좋다'의 의미로 가장 알맞은 것은?",
        "options": [
          "제38과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제38과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 39,
    "book": 2,
    "lessonNum": 39,
    "title": "오늘 회식을 하자고 해요",
    "titleEng": "They Say Let's Have a Company Dinner Today",
    "category": "회식 문화",
    "categoryColor": "#8b5cf6",
    "goal": "직장 회식의 긍정적 의미를 알고 올바르게 참여할 수 있다.",
    "grammar": [
      {
        "name": "-자고 하다 (간접화법)",
        "summary": "오늘 회식을 하자고 해요 핵심 문법",
        "details": "단원 39과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -자고 하다 (간접화법) 완료해야 합니다.",
          "반장님과 함께 -자고 하다 (간접화법) 상의하세요."
        ]
      },
      {
        "name": "-(으)라고 하다",
        "summary": "오늘 회식을 하자고 해요 핵심 문법",
        "details": "단원 39과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)라고 하다 완료해야 합니다.",
          "반장님과 함께 -(으)라고 하다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "회식",
        "meaning": "Standard term for 회식",
        "pron": "korean-pron",
        "example": "회식 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "건배사",
        "meaning": "Standard term for 건배사",
        "pron": "korean-pron",
        "example": "건배사 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "2차 가기",
        "meaning": "Standard term for 2차 가기",
        "pron": "korean-pron",
        "example": "2차 가기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "음주 예절",
        "meaning": "Standard term for 음주 예절",
        "pron": "korean-pron",
        "example": "음주 예절 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 오늘 회식을 하자고 해요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 오늘 회식을 하자고 해요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '오늘 회식을 하자고 해요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 회식 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 회식 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제39과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제39과 '오늘 회식을 하자고 해요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "직장 회식의 긍정적 의미를 알고 올바르게 참여할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제39과의 핵심 목표는 '직장 회식의 긍정적 의미를 알고 올바르게 참여할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제39과의 핵심 문법 '-자고 하다 (간접화법)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '회식'의 의미로 가장 알맞은 것은?",
        "options": [
          "제39과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제39과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 40,
    "book": 2,
    "lessonNum": 40,
    "title": "불쾌감을 느꼈다면 그건 성희롱이에요",
    "titleEng": "If You Felt Offended, That is Harassment",
    "category": "직장 내 성희롱 예방",
    "categoryColor": "#ef4444",
    "goal": "성희롱 피해 발생 시 대처 요령과 신고 절차를 숙지할 수 있다.",
    "grammar": [
      {
        "name": "-다면 (가정)",
        "summary": "불쾌감을 느꼈다면 그건 성희롱이에요 핵심 문법",
        "details": "단원 40과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -다면 (가정) 완료해야 합니다.",
          "반장님과 함께 -다면 (가정) 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄴ 적이 있다",
        "summary": "불쾌감을 느꼈다면 그건 성희롱이에요 핵심 문법",
        "details": "단원 40과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 적이 있다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 적이 있다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "성희롱 예방 교육",
        "meaning": "Standard term for 성희롱 예방 교육",
        "pron": "korean-pron",
        "example": "성희롱 예방 교육 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "거부 의사 표시",
        "meaning": "Standard term for 거부 의사 표시",
        "pron": "korean-pron",
        "example": "거부 의사 표시 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "고충 상담",
        "meaning": "Standard term for 고충 상담",
        "pron": "korean-pron",
        "example": "고충 상담 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 불쾌감을 느꼈다면 그건 성희롱이에요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 불쾌감을 느꼈다면 그건 성희롱이에요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '불쾌감을 느꼈다면 그건 성희롱이에요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 성희롱 예방 교육 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 성희롱 예방 교육 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제40과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제40과 '불쾌감을 느꼈다면 그건 성희롱이에요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "성희롱 피해 발생 시 대처 요령과 신고 절차를 숙지할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제40과의 핵심 목표는 '성희롱 피해 발생 시 대처 요령과 신고 절차를 숙지할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제40과의 핵심 문법 '-다면 (가정)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '성희롱 예방 교육'의 의미로 가장 알맞은 것은?",
        "options": [
          "제40과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제40과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 41,
    "book": 2,
    "lessonNum": 41,
    "title": "드라이버로 해 보세요",
    "titleEng": "Try Doing It With a Screwdriver (Hand Tools)",
    "category": "제조업 기본 공구",
    "categoryColor": "#3b82f6",
    "goal": "제조업 수공구의 명칭을 알고 안전하게 다룰 수 있다.",
    "grammar": [
      {
        "name": "-(으)로 (도구/수단)",
        "summary": "드라이버로 해 보세요 핵심 문법",
        "details": "단원 41과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)로 (도구/수단) 완료해야 합니다.",
          "반장님과 함께 -(으)로 (도구/수단) 상의하세요."
        ]
      },
      {
        "name": "-고 있다",
        "summary": "드라이버로 해 보세요 핵심 문법",
        "details": "단원 41과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -고 있다 완료해야 합니다.",
          "반장님과 함께 -고 있다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "드라이버",
        "meaning": "Standard term for 드라이버",
        "pron": "korean-pron",
        "example": "드라이버 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "스패너",
        "meaning": "Standard term for 스패너",
        "pron": "korean-pron",
        "example": "스패너 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "펜치",
        "meaning": "Standard term for 펜치",
        "pron": "korean-pron",
        "example": "펜치 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "니퍼",
        "meaning": "Standard term for 니퍼",
        "pron": "korean-pron",
        "example": "니퍼 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "볼트",
        "meaning": "Standard term for 볼트",
        "pron": "korean-pron",
        "example": "볼트 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "너트",
        "meaning": "Standard term for 너트",
        "pron": "korean-pron",
        "example": "너트 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 드라이버로 해 보세요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 드라이버로 해 보세요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '드라이버로 해 보세요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 드라이버 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 드라이버 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제41과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제41과 '드라이버로 해 보세요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "제조업 수공구의 명칭을 알고 안전하게 다룰 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제41과의 핵심 목표는 '제조업 수공구의 명칭을 알고 안전하게 다룰 수 있다.'입니다."
      },
      {
        "q": "다음 중 제41과의 핵심 문법 '-(으)로 (도구/수단)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '드라이버'의 의미로 가장 알맞은 것은?",
        "options": [
          "제41과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제41과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 42,
    "book": 2,
    "lessonNum": 42,
    "title": "이 기계 어떻게 작동하는지 알아요?",
    "titleEng": "Do You Know How to Operate This Machine?",
    "category": "기계 작동 및 조작",
    "categoryColor": "#f59e0b",
    "goal": "기계 설비의 시운전과 작동 순서를 설명하고 조작할 수 있다.",
    "grammar": [
      {
        "name": "-는지 알다",
        "summary": "이 기계 어떻게 작동하는지 알아요? 핵심 문법",
        "details": "단원 42과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는지 알다 완료해야 합니다.",
          "반장님과 함께 -는지 알다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ 줄 알다",
        "summary": "이 기계 어떻게 작동하는지 알아요? 핵심 문법",
        "details": "단원 42과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 줄 알다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 줄 알다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "전원 스위치",
        "meaning": "Standard term for 전원 스위치",
        "pron": "korean-pron",
        "example": "전원 스위치 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "레버 당기기",
        "meaning": "Standard term for 레버 당기기",
        "pron": "korean-pron",
        "example": "레버 당기기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "비상정지 버튼",
        "meaning": "Standard term for 비상정지 버튼",
        "pron": "korean-pron",
        "example": "비상정지 버튼 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 이 기계 어떻게 작동하는지 알아요? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 이 기계 어떻게 작동하는지 알아요? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '이 기계 어떻게 작동하는지 알아요?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 전원 스위치 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 전원 스위치 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제42과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제42과 '이 기계 어떻게 작동하는지 알아요?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "기계 설비의 시운전과 작동 순서를 설명하고 조작할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제42과의 핵심 목표는 '기계 설비의 시운전과 작동 순서를 설명하고 조작할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제42과의 핵심 문법 '-는지 알다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '전원 스위치'의 의미로 가장 알맞은 것은?",
        "options": [
          "제42과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제42과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 43,
    "book": 2,
    "lessonNum": 43,
    "title": "철근을 옮겨 놓으세요",
    "titleEng": "Move and Stack the Rebar (Construction Site)",
    "category": "건설업 현장 작업",
    "categoryColor": "#f97316",
    "goal": "건설 자재 운반과 현장 위험 요소를 관리할 수 있다.",
    "grammar": [
      {
        "name": "-아/어 놓다",
        "summary": "철근을 옮겨 놓으세요 핵심 문법",
        "details": "단원 43과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 놓다 완료해야 합니다.",
          "반장님과 함께 -아/어 놓다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ 테니까",
        "summary": "철근을 옮겨 놓으세요 핵심 문법",
        "details": "단원 43과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 테니까 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 테니까 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "철근",
        "meaning": "Standard term for 철근",
        "pron": "korean-pron",
        "example": "철근 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "시멘트",
        "meaning": "Standard term for 시멘트",
        "pron": "korean-pron",
        "example": "시멘트 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "비계",
        "meaning": "Standard term for 비계",
        "pron": "korean-pron",
        "example": "비계 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "손수레",
        "meaning": "Standard term for 손수레",
        "pron": "korean-pron",
        "example": "손수레 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "자재 정리",
        "meaning": "Standard term for 자재 정리",
        "pron": "korean-pron",
        "example": "자재 정리 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 철근을 옮겨 놓으세요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 철근을 옮겨 놓으세요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '철근을 옮겨 놓으세요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 철근 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 철근 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제43과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제43과 '철근을 옮겨 놓으세요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "건설 자재 운반과 현장 위험 요소를 관리할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제43과의 핵심 목표는 '건설 자재 운반과 현장 위험 요소를 관리할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제43과의 핵심 문법 '-아/어 놓다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '철근'의 의미로 가장 알맞은 것은?",
        "options": [
          "제43과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제43과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 44,
    "book": 2,
    "lessonNum": 44,
    "title": "페인트 작업을 했거든요",
    "titleEng": "Because I Did Painting Work (Work Environment)",
    "category": "작업장 환경 정리",
    "categoryColor": "#06b6d4",
    "goal": "도장 작업 시 유해물질 중독을 막고 환경을 환기할 수 있다.",
    "grammar": [
      {
        "name": "-거든요 (이유)",
        "summary": "페인트 작업을 했거든요 핵심 문법",
        "details": "단원 44과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -거든요 (이유) 완료해야 합니다.",
          "반장님과 함께 -거든요 (이유) 상의하세요."
        ]
      },
      {
        "name": "-지 않도록",
        "summary": "페인트 작업을 했거든요 핵심 문법",
        "details": "단원 44과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -지 않도록 완료해야 합니다.",
          "반장님과 함께 -지 않도록 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "환기 팬 가동",
        "meaning": "Standard term for 환기 팬 가동",
        "pron": "korean-pron",
        "example": "환기 팬 가동 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "유해가스",
        "meaning": "Standard term for 유해가스",
        "pron": "korean-pron",
        "example": "유해가스 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "마스크 착용",
        "meaning": "Standard term for 마스크 착용",
        "pron": "korean-pron",
        "example": "마스크 착용 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "페인트",
        "meaning": "Standard term for 페인트",
        "pron": "korean-pron",
        "example": "페인트 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 페인트 작업을 했거든요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 페인트 작업을 했거든요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '페인트 작업을 했거든요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 환기 팬 가동 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 환기 팬 가동 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제44과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제44과 '페인트 작업을 했거든요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "도장 작업 시 유해물질 중독을 막고 환경을 환기할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제44과의 핵심 목표는 '도장 작업 시 유해물질 중독을 막고 환경을 환기할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제44과의 핵심 문법 '-거든요 (이유)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '환기 팬 가동'의 의미로 가장 알맞은 것은?",
        "options": [
          "제44과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제44과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 45,
    "book": 2,
    "lessonNum": 45,
    "title": "호미를 챙겼는데요",
    "titleEng": "I Packed the Hand Hoe (Farming & Agriculture)",
    "category": "농업과 작물 재배",
    "categoryColor": "#10b981",
    "goal": "농기구 사용법과 계절별 영농 일과를 숙지할 수 있다.",
    "grammar": [
      {
        "name": "-는데 (배경)",
        "summary": "호미를 챙겼는데요 핵심 문법",
        "details": "단원 45과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는데 (배경) 완료해야 합니다.",
          "반장님과 함께 -는데 (배경) 상의하세요."
        ]
      },
      {
        "name": "-기로 하다",
        "summary": "호미를 챙겼는데요 핵심 문법",
        "details": "단원 45과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기로 하다 완료해야 합니다.",
          "반장님과 함께 -기로 하다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "호미",
        "meaning": "Standard term for 호미",
        "pron": "korean-pron",
        "example": "호미 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "낫",
        "meaning": "Standard term for 낫",
        "pron": "korean-pron",
        "example": "낫 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "비닐하우스",
        "meaning": "Standard term for 비닐하우스",
        "pron": "korean-pron",
        "example": "비닐하우스 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "모종 심기",
        "meaning": "Standard term for 모종 심기",
        "pron": "korean-pron",
        "example": "모종 심기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "수확",
        "meaning": "Standard term for 수확",
        "pron": "korean-pron",
        "example": "수확 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 호미를 챙겼는데요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 호미를 챙겼는데요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '호미를 챙겼는데요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 호미 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 호미 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제45과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제45과 '호미를 챙겼는데요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "농기구 사용법과 계절별 영농 일과를 숙지할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제45과의 핵심 목표는 '농기구 사용법과 계절별 영농 일과를 숙지할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제45과의 핵심 문법 '-는데 (배경)'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '호미'의 의미로 가장 알맞은 것은?",
        "options": [
          "제45과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제45과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 46,
    "book": 2,
    "lessonNum": 46,
    "title": "더 신경 쓰도록 하자",
    "titleEng": "Let's Pay More Attention (Livestock Care)",
    "category": "축산업 관리",
    "categoryColor": "#ec4899",
    "goal": "가축 위생 관리와 축사 방역 작업을 수행할 수 있다.",
    "grammar": [
      {
        "name": "-도록 하다",
        "summary": "더 신경 쓰도록 하자 핵심 문법",
        "details": "단원 46과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -도록 하다 완료해야 합니다.",
          "반장님과 함께 -도록 하다 상의하세요."
        ]
      },
      {
        "name": "-게 되다",
        "summary": "더 신경 쓰도록 하자 핵심 문법",
        "details": "단원 46과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -게 되다 완료해야 합니다.",
          "반장님과 함께 -게 되다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "사료 주기",
        "meaning": "Standard term for 사료 주기",
        "pron": "korean-pron",
        "example": "사료 주기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "분뇨 치우기",
        "meaning": "Standard term for 분뇨 치우기",
        "pron": "korean-pron",
        "example": "분뇨 치우기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "소독약 살포",
        "meaning": "Standard term for 소독약 살포",
        "pron": "korean-pron",
        "example": "소독약 살포 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "환기",
        "meaning": "Standard term for 환기",
        "pron": "korean-pron",
        "example": "환기 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 더 신경 쓰도록 하자 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 더 신경 쓰도록 하자 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '더 신경 쓰도록 하자' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 사료 주기 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 사료 주기 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제46과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제46과 '더 신경 쓰도록 하자'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "가축 위생 관리와 축사 방역 작업을 수행할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제46과의 핵심 목표는 '가축 위생 관리와 축사 방역 작업을 수행할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제46과의 핵심 문법 '-도록 하다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '사료 주기'의 의미로 가장 알맞은 것은?",
        "options": [
          "제46과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제46과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 47,
    "book": 2,
    "lessonNum": 47,
    "title": "재고를 파악하는 것이 중요해요",
    "titleEng": "It is Important to Check Inventory (Logistics)",
    "category": "창고 관리와 물류",
    "categoryColor": "#3b82f6",
    "goal": "창고 내 물품의 정확한 입출고와 재고 실사를 할 수 있다.",
    "grammar": [
      {
        "name": "-는 것이 중요하다",
        "summary": "재고를 파악하는 것이 중요해요 핵심 문법",
        "details": "단원 47과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는 것이 중요하다 완료해야 합니다.",
          "반장님과 함께 -는 것이 중요하다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄴ 채로",
        "summary": "재고를 파악하는 것이 중요해요 핵심 문법",
        "details": "단원 47과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 채로 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 채로 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "재고 파악",
        "meaning": "Standard term for 재고 파악",
        "pron": "korean-pron",
        "example": "재고 파악 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "출고",
        "meaning": "Standard term for 출고",
        "pron": "korean-pron",
        "example": "출고 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "입고",
        "meaning": "Standard term for 입고",
        "pron": "korean-pron",
        "example": "입고 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "지게차",
        "meaning": "Standard term for 지게차",
        "pron": "korean-pron",
        "example": "지게차 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "바코드",
        "meaning": "Standard term for 바코드",
        "pron": "korean-pron",
        "example": "바코드 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 재고를 파악하는 것이 중요해요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 재고를 파악하는 것이 중요해요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '재고를 파악하는 것이 중요해요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 재고 파악 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 재고 파악 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제47과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제47과 '재고를 파악하는 것이 중요해요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "창고 내 물품의 정확한 입출고와 재고 실사를 할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제47과의 핵심 목표는 '창고 내 물품의 정확한 입출고와 재고 실사를 할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제47과의 핵심 문법 '-는 것이 중요하다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '재고 파악'의 의미로 가장 알맞은 것은?",
        "options": [
          "제47과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제47과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 48,
    "book": 2,
    "lessonNum": 48,
    "title": "다치지 않도록 조심하세요",
    "titleEng": "Be Careful Not to Get Hurt (Press & Cutters)",
    "category": "기계 안전사고 예방",
    "categoryColor": "#ef4444",
    "goal": "프레스·절단기 작업 시 끼임 협착 사고를 방지할 수 있다.",
    "grammar": [
      {
        "name": "-도록 조심하다",
        "summary": "다치지 않도록 조심하세요 핵심 문법",
        "details": "단원 48과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -도록 조심하다 완료해야 합니다.",
          "반장님과 함께 -도록 조심하다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ 뻔하다",
        "summary": "다치지 않도록 조심하세요 핵심 문법",
        "details": "단원 48과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 뻔하다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 뻔하다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "프레스 기계",
        "meaning": "Standard term for 프레스 기계",
        "pron": "korean-pron",
        "example": "프레스 기계 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "끼임 사고",
        "meaning": "Standard term for 끼임 사고",
        "pron": "korean-pron",
        "example": "끼임 사고 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "절단 위험",
        "meaning": "Standard term for 절단 위험",
        "pron": "korean-pron",
        "example": "절단 위험 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "센서",
        "meaning": "Standard term for 센서",
        "pron": "korean-pron",
        "example": "센서 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 다치지 않도록 조심하세요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 다치지 않도록 조심하세요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '다치지 않도록 조심하세요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 프레스 기계 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 프레스 기계 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제48과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제48과 '다치지 않도록 조심하세요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "프레스·절단기 작업 시 끼임 협착 사고를 방지할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제48과의 핵심 목표는 '프레스·절단기 작업 시 끼임 협착 사고를 방지할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제48과의 핵심 문법 '-도록 조심하다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '프레스 기계'의 의미로 가장 알맞은 것은?",
        "options": [
          "제48과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제48과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 49,
    "book": 2,
    "lessonNum": 49,
    "title": "안전화를 안 신으면 다칠 수 있어요",
    "titleEng": "If You Don't Wear Safety Shoes, You May Get Hurt",
    "category": "보호구 착용",
    "categoryColor": "#ef4444",
    "goal": "신체 보호구를 작업 전 의무적으로 올바르게 착용할 수 있다.",
    "grammar": [
      {
        "name": "-지 않으면 안 되다",
        "summary": "안전화를 안 신으면 다칠 수 있어요 핵심 문법",
        "details": "단원 49과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -지 않으면 안 되다 완료해야 합니다.",
          "반장님과 함께 -지 않으면 안 되다 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ 수 있다",
        "summary": "안전화를 안 신으면 다칠 수 있어요 핵심 문법",
        "details": "단원 49과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 수 있다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 수 있다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "안전화",
        "meaning": "Standard term for 안전화",
        "pron": "korean-pron",
        "example": "안전화 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "안전모",
        "meaning": "Standard term for 안전모",
        "pron": "korean-pron",
        "example": "안전모 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "방진마스크",
        "meaning": "Standard term for 방진마스크",
        "pron": "korean-pron",
        "example": "방진마스크 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "귀마개",
        "meaning": "Standard term for 귀마개",
        "pron": "korean-pron",
        "example": "귀마개 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "보안경",
        "meaning": "Standard term for 보안경",
        "pron": "korean-pron",
        "example": "보안경 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 안전화를 안 신으면 다칠 수 있어요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 안전화를 안 신으면 다칠 수 있어요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '안전화를 안 신으면 다칠 수 있어요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 안전화 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 안전화 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제49과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제49과 '안전화를 안 신으면 다칠 수 있어요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "신체 보호구를 작업 전 의무적으로 올바르게 착용할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제49과의 핵심 목표는 '신체 보호구를 작업 전 의무적으로 올바르게 착용할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제49과의 핵심 문법 '-지 않으면 안 되다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '안전화'의 의미로 가장 알맞은 것은?",
        "options": [
          "제49과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제49과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 50,
    "book": 2,
    "lessonNum": 50,
    "title": "열심히 해 준 덕분이에요",
    "titleEng": "Thanks to Your Hard Work (Safety Inspection)",
    "category": "안전 점검과 평가",
    "categoryColor": "#10b981",
    "goal": "현장 5S(정리/정돈/청소/청결/습관화) 활동을 주도할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ 덕분에",
        "summary": "열심히 해 준 덕분이에요 핵심 문법",
        "details": "단원 50과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 덕분에 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 덕분에 상의하세요."
        ]
      },
      {
        "name": "-아/어 두다",
        "summary": "열심히 해 준 덕분이에요 핵심 문법",
        "details": "단원 50과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 두다 완료해야 합니다.",
          "반장님과 함께 -아/어 두다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "안전 수칙 준수",
        "meaning": "Standard term for 안전 수칙 준수",
        "pron": "korean-pron",
        "example": "안전 수칙 준수 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "무재해 달성",
        "meaning": "Standard term for 무재해 달성",
        "pron": "korean-pron",
        "example": "무재해 달성 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "정기 점검",
        "meaning": "Standard term for 정기 점검",
        "pron": "korean-pron",
        "example": "정기 점검 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 열심히 해 준 덕분이에요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 열심히 해 준 덕분이에요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '열심히 해 준 덕분이에요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 안전 수칙 준수 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 안전 수칙 준수 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제50과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제50과 '열심히 해 준 덕분이에요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "현장 5S(정리/정돈/청소/청결/습관화) 활동을 주도할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제50과의 핵심 목표는 '현장 5S(정리/정돈/청소/청결/습관화) 활동을 주도할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제50과의 핵심 문법 '-(으)ㄴ 덕분에'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '안전 수칙 준수'의 의미로 가장 알맞은 것은?",
        "options": [
          "제50과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제50과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 51,
    "book": 2,
    "lessonNum": 51,
    "title": "한국에 가서 일하고 싶은데요",
    "titleEng": "I Want to Go to Korea and Work (EPS System)",
    "category": "고용허가제 이해",
    "categoryColor": "#8b5cf6",
    "goal": "고용허가제(EPS) 도입 취지와 취업 절차를 이해할 수 있다.",
    "grammar": [
      {
        "name": "-고 싶다",
        "summary": "한국에 가서 일하고 싶은데요 핵심 문법",
        "details": "단원 51과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -고 싶다 완료해야 합니다.",
          "반장님과 함께 -고 싶다 상의하세요."
        ]
      },
      {
        "name": "-(으)려면",
        "summary": "한국에 가서 일하고 싶은데요 핵심 문법",
        "details": "단원 51과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)려면 완료해야 합니다.",
          "반장님과 함께 -(으)려면 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "구직자 명부 등재",
        "meaning": "Standard term for 구직자 명부 등재",
        "pron": "korean-pron",
        "example": "구직자 명부 등재 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "고용허가서",
        "meaning": "Standard term for 고용허가서",
        "pron": "korean-pron",
        "example": "고용허가서 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "입국 절차",
        "meaning": "Standard term for 입국 절차",
        "pron": "korean-pron",
        "example": "입국 절차 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 한국에 가서 일하고 싶은데요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 한국에 가서 일하고 싶은데요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '한국에 가서 일하고 싶은데요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 구직자 명부 등재 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 구직자 명부 등재 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제51과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제51과 '한국에 가서 일하고 싶은데요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "고용허가제(EPS) 도입 취지와 취업 절차를 이해할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제51과의 핵심 목표는 '고용허가제(EPS) 도입 취지와 취업 절차를 이해할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제51과의 핵심 문법 '-고 싶다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '구직자 명부 등재'의 의미로 가장 알맞은 것은?",
        "options": [
          "제51과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제51과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 52,
    "book": 2,
    "lessonNum": 52,
    "title": "근로 조건이 좋은 편이에요",
    "titleEng": "Working Conditions Are Quite Good (Contract)",
    "category": "근로계약서 체결",
    "categoryColor": "#3b82f6",
    "goal": "표준근로계약서의 주요 조항을 확인하고 서명할 수 있다.",
    "grammar": [
      {
        "name": "-는 편이다",
        "summary": "근로 조건이 좋은 편이에요 핵심 문법",
        "details": "단원 52과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -는 편이다 완료해야 합니다.",
          "반장님과 함께 -는 편이다 상의하세요."
        ]
      },
      {
        "name": "-기 마련이다",
        "summary": "근로 조건이 좋은 편이에요 핵심 문법",
        "details": "단원 52과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 마련이다 완료해야 합니다.",
          "반장님과 함께 -기 마련이다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "기본급",
        "meaning": "Standard term for 기본급",
        "pron": "korean-pron",
        "example": "기본급 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "수당",
        "meaning": "Standard term for 수당",
        "pron": "korean-pron",
        "example": "수당 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "근로시간(주 40시간)",
        "meaning": "Standard term for 근로시간(주 40시간)",
        "pron": "korean-pron",
        "example": "근로시간(주 40시간) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "수습기간",
        "meaning": "Standard term for 수습기간",
        "pron": "korean-pron",
        "example": "수습기간 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 근로 조건이 좋은 편이에요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 근로 조건이 좋은 편이에요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '근로 조건이 좋은 편이에요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 기본급 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 기본급 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제52과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제52과 '근로 조건이 좋은 편이에요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "표준근로계약서의 주요 조항을 확인하고 서명할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제52과의 핵심 목표는 '표준근로계약서의 주요 조항을 확인하고 서명할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제52과의 핵심 문법 '-는 편이다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '기본급'의 의미로 가장 알맞은 것은?",
        "options": [
          "제52과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제52과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 53,
    "book": 2,
    "lessonNum": 53,
    "title": "외국인 등록을 하러 가요",
    "titleEng": "I Am Going to Do Alien Registration (Immigration)",
    "category": "외국인등록증 발급",
    "categoryColor": "#06b6d4",
    "goal": "입국 90일 이내에 외국인등록을 마칠 수 있다.",
    "grammar": [
      {
        "name": "-(으)러 가다",
        "summary": "외국인 등록을 하러 가요 핵심 문법",
        "details": "단원 53과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)러 가다 완료해야 합니다.",
          "반장님과 함께 -(으)러 가다 상의하세요."
        ]
      },
      {
        "name": "-기 전에",
        "summary": "외국인 등록을 하러 가요 핵심 문법",
        "details": "단원 53과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 전에 완료해야 합니다.",
          "반장님과 함께 -기 전에 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "출입국관리사무소",
        "meaning": "Standard term for 출입국관리사무소",
        "pron": "korean-pron",
        "example": "출입국관리사무소 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "여권",
        "meaning": "Standard term for 여권",
        "pron": "korean-pron",
        "example": "여권 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "지문 등록",
        "meaning": "Standard term for 지문 등록",
        "pron": "korean-pron",
        "example": "지문 등록 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "등록증",
        "meaning": "Standard term for 등록증",
        "pron": "korean-pron",
        "example": "등록증 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 외국인 등록을 하러 가요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 외국인 등록을 하러 가요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '외국인 등록을 하러 가요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 출입국관리사무소 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 출입국관리사무소 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제53과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제53과 '외국인 등록을 하러 가요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "입국 90일 이내에 외국인등록을 마칠 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제53과의 핵심 목표는 '입국 90일 이내에 외국인등록을 마칠 수 있다.'입니다."
      },
      {
        "q": "다음 중 제53과의 핵심 문법 '-(으)러 가다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '출입국관리사무소'의 의미로 가장 알맞은 것은?",
        "options": [
          "제53과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제53과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 54,
    "book": 2,
    "lessonNum": 54,
    "title": "보험금을 신청하려고 해요",
    "titleEng": "I Plan to Apply for Insurance Benefits (Insurances)",
    "category": "외국인 전용 보험",
    "categoryColor": "#f59e0b",
    "goal": "4대 전용 보험 가입과 보험금 청구 서류를 구비할 수 있다.",
    "grammar": [
      {
        "name": "-(으)려고 하다",
        "summary": "보험금을 신청하려고 해요 핵심 문법",
        "details": "단원 54과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)려고 하다 완료해야 합니다.",
          "반장님과 함께 -(으)려고 하다 상의하세요."
        ]
      },
      {
        "name": "-(으)면 되다",
        "summary": "보험금을 신청하려고 해요 핵심 문법",
        "details": "단원 54과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)면 되다 완료해야 합니다.",
          "반장님과 함께 -(으)면 되다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "출국만기보험",
        "meaning": "Standard term for 출국만기보험",
        "pron": "korean-pron",
        "example": "출국만기보험 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "귀국비용보험",
        "meaning": "Standard term for 귀국비용보험",
        "pron": "korean-pron",
        "example": "귀국비용보험 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "상해보험",
        "meaning": "Standard term for 상해보험",
        "pron": "korean-pron",
        "example": "상해보험 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "산재보험",
        "meaning": "Standard term for 산재보험",
        "pron": "korean-pron",
        "example": "산재보험 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 보험금을 신청하려고 해요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 보험금을 신청하려고 해요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '보험금을 신청하려고 해요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 출국만기보험 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 출국만기보험 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제54과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제54과 '보험금을 신청하려고 해요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "4대 전용 보험 가입과 보험금 청구 서류를 구비할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제54과의 핵심 목표는 '4대 전용 보험 가입과 보험금 청구 서류를 구비할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제54과의 핵심 문법 '-(으)려고 하다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '출국만기보험'의 의미로 가장 알맞은 것은?",
        "options": [
          "제54과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제54과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 55,
    "book": 2,
    "lessonNum": 55,
    "title": "급여 명세서를 확인해 보세요",
    "titleEng": "Please Check Your Pay Stub (Wages & Deductions)",
    "category": "임금과 급여 계산",
    "categoryColor": "#10b981",
    "goal": "급여 명세서의 항목별 계산 내역을 검토할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄹ 때마다",
        "summary": "급여 명세서를 확인해 보세요 핵심 문법",
        "details": "단원 55과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 때마다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 때마다 상의하세요."
        ]
      },
      {
        "name": "-아/어 보다",
        "summary": "급여 명세서를 확인해 보세요 핵심 문법",
        "details": "단원 55과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 보다 완료해야 합니다.",
          "반장님과 함께 -아/어 보다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "기본급",
        "meaning": "Standard term for 기본급",
        "pron": "korean-pron",
        "example": "기본급 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "연장수당",
        "meaning": "Standard term for 연장수당",
        "pron": "korean-pron",
        "example": "연장수당 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "야간수당",
        "meaning": "Standard term for 야간수당",
        "pron": "korean-pron",
        "example": "야간수당 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "세금 공제",
        "meaning": "Standard term for 세금 공제",
        "pron": "korean-pron",
        "example": "세금 공제 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "실수령액",
        "meaning": "Standard term for 실수령액",
        "pron": "korean-pron",
        "example": "실수령액 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 급여 명세서를 확인해 보세요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 급여 명세서를 확인해 보세요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '급여 명세서를 확인해 보세요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 기본급 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 기본급 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제55과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제55과 '급여 명세서를 확인해 보세요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "급여 명세서의 항목별 계산 내역을 검토할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제55과의 핵심 목표는 '급여 명세서의 항목별 계산 내역을 검토할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제55과의 핵심 문법 '-(으)ㄹ 때마다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '기본급'의 의미로 가장 알맞은 것은?",
        "options": [
          "제55과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제55과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 56,
    "book": 2,
    "lessonNum": 56,
    "title": "이번 여름 휴가 계획은 세웠어?",
    "titleEng": "Did You Make Summer Vacation Plans? (Leaves)",
    "category": "휴가와 휴일",
    "categoryColor": "#ec4899",
    "goal": "정당한 휴가 권리를 신청서 작성과 함께 행사할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ 적이 없다",
        "summary": "이번 여름 휴가 계획은 세웠어? 핵심 문법",
        "details": "단원 56과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 적이 없다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 적이 없다 상의하세요."
        ]
      },
      {
        "name": "-기로 하다",
        "summary": "이번 여름 휴가 계획은 세웠어? 핵심 문법",
        "details": "단원 56과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기로 하다 완료해야 합니다.",
          "반장님과 함께 -기로 하다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "연차 유급휴가",
        "meaning": "Standard term for 연차 유급휴가",
        "pron": "korean-pron",
        "example": "연차 유급휴가 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "병가",
        "meaning": "Standard term for 병가",
        "pron": "korean-pron",
        "example": "병가 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "경조사 휴가",
        "meaning": "Standard term for 경조사 휴가",
        "pron": "korean-pron",
        "example": "경조사 휴가 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "휴가 신청서",
        "meaning": "Standard term for 휴가 신청서",
        "pron": "korean-pron",
        "example": "휴가 신청서 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 이번 여름 휴가 계획은 세웠어? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 이번 여름 휴가 계획은 세웠어? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '이번 여름 휴가 계획은 세웠어?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 연차 유급휴가 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 연차 유급휴가 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제56과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제56과 '이번 여름 휴가 계획은 세웠어?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "정당한 휴가 권리를 신청서 작성과 함께 행사할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제56과의 핵심 목표는 '정당한 휴가 권리를 신청서 작성과 함께 행사할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제56과의 핵심 문법 '-(으)ㄴ 적이 없다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '연차 유급휴가'의 의미로 가장 알맞은 것은?",
        "options": [
          "제56과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제56과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 57,
    "book": 2,
    "lessonNum": 57,
    "title": "사업장을 변경하고 싶은데",
    "titleEng": "I Want to Change Workplace (Job Transfer)",
    "category": "사업장 변경 절차",
    "categoryColor": "#ef4444",
    "goal": "합법적인 사업장 변경 사유와 허가 기한을 이해할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ데",
        "summary": "사업장을 변경하고 싶은데 핵심 문법",
        "details": "단원 57과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ데 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ데 상의하세요."
        ]
      },
      {
        "name": "-(으)ㄹ 수밖에 없다",
        "summary": "사업장을 변경하고 싶은데 핵심 문법",
        "details": "단원 57과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄹ 수밖에 없다 완료해야 합니다.",
          "반장님과 함께 -(으)ㄹ 수밖에 없다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "임금 체불",
        "meaning": "Standard term for 임금 체불",
        "pron": "korean-pron",
        "example": "임금 체불 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "부당 대우",
        "meaning": "Standard term for 부당 대우",
        "pron": "korean-pron",
        "example": "부당 대우 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "폐업",
        "meaning": "Standard term for 폐업",
        "pron": "korean-pron",
        "example": "폐업 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "고용센터 신청",
        "meaning": "Standard term for 고용센터 신청",
        "pron": "korean-pron",
        "example": "고용센터 신청 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 사업장을 변경하고 싶은데 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 사업장을 변경하고 싶은데 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '사업장을 변경하고 싶은데' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 임금 체불 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 임금 체불 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제57과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제57과 '사업장을 변경하고 싶은데'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "합법적인 사업장 변경 사유와 허가 기한을 이해할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제57과의 핵심 목표는 '합법적인 사업장 변경 사유와 허가 기한을 이해할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제57과의 핵심 문법 '-(으)ㄴ데'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '임금 체불'의 의미로 가장 알맞은 것은?",
        "options": [
          "제57과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제57과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 58,
    "book": 2,
    "lessonNum": 58,
    "title": "체류 기간을 연장해야 해요",
    "titleEng": "I Need to Extend Period of Stay (Visa Status)",
    "category": "체류기간 연장",
    "categoryColor": "#8b5cf6",
    "goal": "체류 만료 전 적법하게 체류 기간을 연장할 수 있다.",
    "grammar": [
      {
        "name": "-아/어야 하다",
        "summary": "체류 기간을 연장해야 해요 핵심 문법",
        "details": "단원 58과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어야 하다 완료해야 합니다.",
          "반장님과 함께 -아/어야 하다 상의하세요."
        ]
      },
      {
        "name": "-기 위해서",
        "summary": "체류 기간을 연장해야 해요 핵심 문법",
        "details": "단원 58과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 위해서 완료해야 합니다.",
          "반장님과 함께 -기 위해서 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "체류기간(3년+1년10개월)",
        "meaning": "Standard term for 체류기간(3년+1년10개월)",
        "pron": "korean-pron",
        "example": "체류기간(3년+1년10개월) 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "성실근로자 재입국",
        "meaning": "Standard term for 성실근로자 재입국",
        "pron": "korean-pron",
        "example": "성실근로자 재입국 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 체류 기간을 연장해야 해요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 체류 기간을 연장해야 해요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '체류 기간을 연장해야 해요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 체류기간(3년+1년10개월) 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 체류기간(3년+1년10개월) ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제58과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제58과 '체류 기간을 연장해야 해요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "체류 만료 전 적법하게 체류 기간을 연장할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제58과의 핵심 목표는 '체류 만료 전 적법하게 체류 기간을 연장할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제58과의 핵심 문법 '-아/어야 하다'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '체류기간(3년+1년10개월)'의 의미로 가장 알맞은 것은?",
        "options": [
          "제58과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제58과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 59,
    "book": 2,
    "lessonNum": 59,
    "title": "산업 재해 보상을 신청했어요",
    "titleEng": "I Applied for Industrial Accident Compensation",
    "category": "산재 보험 청구",
    "categoryColor": "#ef4444",
    "goal": "업무 중 부상 시 산재 치료와 보상금을 청구할 수 있다.",
    "grammar": [
      {
        "name": "-(으)ㄴ 지",
        "summary": "산업 재해 보상을 신청했어요 핵심 문법",
        "details": "단원 59과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -(으)ㄴ 지 완료해야 합니다.",
          "반장님과 함께 -(으)ㄴ 지 상의하세요."
        ]
      },
      {
        "name": "-아/어 주다",
        "summary": "산업 재해 보상을 신청했어요 핵심 문법",
        "details": "단원 59과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 주다 완료해야 합니다.",
          "반장님과 함께 -아/어 주다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "요양급여",
        "meaning": "Standard term for 요양급여",
        "pron": "korean-pron",
        "example": "요양급여 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "휴업급여",
        "meaning": "Standard term for 휴업급여",
        "pron": "korean-pron",
        "example": "휴업급여 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "근로복지공단",
        "meaning": "Standard term for 근로복지공단",
        "pron": "korean-pron",
        "example": "근로복지공단 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "장해급여",
        "meaning": "Standard term for 장해급여",
        "pron": "korean-pron",
        "example": "장해급여 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 산업 재해 보상을 신청했어요 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 산업 재해 보상을 신청했어요 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '산업 재해 보상을 신청했어요' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 요양급여 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 요양급여 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제59과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제59과 '산업 재해 보상을 신청했어요'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "업무 중 부상 시 산재 치료와 보상금을 청구할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제59과의 핵심 목표는 '업무 중 부상 시 산재 치료와 보상금을 청구할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제59과의 핵심 문법 '-(으)ㄴ 지'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '요양급여'의 의미로 가장 알맞은 것은?",
        "options": [
          "제59과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제59과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  },
  {
    "id": 60,
    "book": 2,
    "lessonNum": 60,
    "title": "귀국 준비는 잘 되고 있어요?",
    "titleEng": "Is Return Preparation Going Well? (Departure)",
    "category": "귀국 준비와 퇴직금",
    "categoryColor": "#10b981",
    "goal": "근무 만료 후 성공적인 귀국 절차를 마무리할 수 있다.",
    "grammar": [
      {
        "name": "-기 전에",
        "summary": "귀국 준비는 잘 되고 있어요? 핵심 문법",
        "details": "단원 60과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -기 전에 완료해야 합니다.",
          "반장님과 함께 -기 전에 상의하세요."
        ]
      },
      {
        "name": "-아/어 놓다",
        "summary": "귀국 준비는 잘 되고 있어요? 핵심 문법",
        "details": "단원 60과의 주요 표현으로 실전 대화 및 문장 구성에서 필수적으로 활용됩니다.",
        "examples": [
          "이 작업을 -아/어 놓다 완료해야 합니다.",
          "반장님과 함께 -아/어 놓다 상의하세요."
        ]
      }
    ],
    "vocabulary": [
      {
        "word": "출국예정신고",
        "meaning": "Standard term for 출국예정신고",
        "pron": "korean-pron",
        "example": "출국예정신고 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "항공권 예매",
        "meaning": "Standard term for 항공권 예매",
        "pron": "korean-pron",
        "example": "항공권 예매 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "퇴직금 수령",
        "meaning": "Standard term for 퇴직금 수령",
        "pron": "korean-pron",
        "example": "퇴직금 수령 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "환전",
        "meaning": "Standard term for 환전",
        "pron": "korean-pron",
        "example": "환전 관련 수칙을 철저히 확인하세요."
      },
      {
        "word": "작업장",
        "meaning": "Workplace",
        "pron": "jak-eop-jang",
        "example": "항상 작업장을 깨끗이 정리합니다."
      },
      {
        "word": "안전제일",
        "meaning": "Safety First",
        "pron": "an-jeon-je-il",
        "example": "우리 공장은 안전제일을 실천해요."
      },
      {
        "word": "한국어",
        "meaning": "Korean Language",
        "pron": "han-guk-eo",
        "example": "한국어를 열심히 공부합니다."
      }
    ],
    "dialogues": [
      {
        "title": "대화 1: 귀국 준비는 잘 되고 있어요? 기본 상황",
        "lines": [
          {
            "speaker": "반장님",
            "role": "현장 관리자",
            "text": "투안 씨, 귀국 준비는 잘 되고 있어요? 관련 작업을 잘 확인해 주세요.",
            "trans": "Mr. Tuan, please verify the work related to '귀국 준비는 잘 되고 있어요?' carefully."
          },
          {
            "speaker": "투안",
            "role": "외국인 근로자",
            "text": "네, 반장님! 말씀하신 대로 안전하게 진행하겠습니다.",
            "trans": "Yes, Manager! I will proceed safely as you instructed."
          }
        ]
      },
      {
        "title": "대화 2: 동료와의 협력",
        "lines": [
          {
            "speaker": "리한",
            "role": "동료 근로자",
            "text": "수루 씨, 오늘 출국예정신고 준비는 다 되었어요?",
            "trans": "Ms. Suru, is the preparation for 출국예정신고 ready today?"
          },
          {
            "speaker": "수루",
            "role": "동료 근로자",
            "text": "네, 준비 끝났어요. 같이 시작합시다!",
            "trans": "Yes, preparation is done. Let's start together!"
          }
        ]
      }
    ],
    "culture": "제60과 표준교재 현장 가이드: 고용허가제(EPS) 외국인 근로자가 한국 현장에서 반드시 준수해야 할 필수 규범과 문화 팁입니다.",
    "quiz": [
      {
        "q": "제60과 '귀국 준비는 잘 되고 있어요?'의 주된 학습 목표는 무엇입니까?",
        "options": [
          "근무 만료 후 성공적인 귀국 절차를 마무리할 수 있다.",
          "외국 여행 예약하기",
          "자동차 운전면허 시험 준비",
          "스마트폰 게임하기"
        ],
        "ans": 1,
        "exp": "제60과의 핵심 목표는 '근무 만료 후 성공적인 귀국 절차를 마무리할 수 있다.'입니다."
      },
      {
        "q": "다음 중 제60과의 핵심 문법 '-기 전에'이 올바르게 쓰인 문장은?",
        "options": [
          "현장에서 작업을 안전하게 해야 합니다.",
          "식당에 가서 밥을 먹어요.",
          "어제 도서관에 갔습니다.",
          "내일 비가 올 것입니다."
        ],
        "ans": 1,
        "exp": "현장 안전과 업무 절차를 나타내는 표준 표현입니다."
      },
      {
        "q": "다음 중 '출국예정신고'의 의미로 가장 알맞은 것은?",
        "options": [
          "제60과 실무에 관련된 주요 어휘/개념",
          "병원에서 약을 짓는 일",
          "집에서 낮잠을 자는 것",
          "바다에서 낚시하는 취미"
        ],
        "ans": 1,
        "exp": "표준교재 제60과에서 다루는 직무 필수 핵심 어휘입니다."
      },
      {
        "q": "작업 현장에서 가장 우선시해야 하는 제1원칙은 무엇입니까?",
        "options": [
          "작업 속도 최우선",
          "안전제일 및 수칙 준수",
          "휴식 시간 늘리기",
          "혼자서만 일하기"
        ],
        "ans": 2,
        "exp": "모든 고용허가제 산업 현장에서 '안전제일'과 안전보호구 착용이 최우선입니다."
      }
    ]
  }
];

if (typeof window !== 'undefined') { window.EPSTOPIK_TEXTBOOK_60 = EPSTOPIK_TEXTBOOK_60; }
if (typeof globalThis !== 'undefined') { globalThis.EPSTOPIK_TEXTBOOK_60 = EPSTOPIK_TEXTBOOK_60; }
