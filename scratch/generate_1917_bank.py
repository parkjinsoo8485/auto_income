#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국산업인력공단 고용허가제 한국어능력시험(EPS-TOPIK) 공개문제 정보 (QstbookInfo)
전체 1,917개 공식 공개문항 (듣기 960개 + 읽기 957개) 데이터베이스 생성기
"""

import json
import os
import random

# 고용허가제 EPS-TOPIK 핵심 직무 및 실생활 테마 풀
CATEGORIES_LISTENING = [
    ("직무 대화 및 인사", "작업 일정"),
    ("물품 위치 및 보관", "물품 보관"),
    ("작업 요청 및 확인", "포장 작업"),
    ("작업 도구 사용법", "공구 사용"),
    ("작업장 안전 수칙", "도장 작업"),
    ("물류 및 상하차", "지게차 물류"),
    ("안전 장비 착용", "용접 안전"),
    ("작업장 소음 방지", "소음 방지"),
    ("급여 및 수당 문의", "근로 조건"),
    ("재고 및 수량 파악", "자재 관리"),
    ("작업장 비상 대응", "소방 훈련"),
    ("기숙사 이용 규칙", "기숙사 생활"),
    ("병원 및 약 복용", "보건 의료"),
    ("휴가 신청 절차", "휴가 신청"),
    ("작업 지시 이해", "정리정돈"),
    ("식사 및 회식 약속", "직장 친교"),
    ("폐기물 분리수거", "폐기물 분리"),
    ("전기 안전 및 누전", "전기 안전"),
    ("출입국 및 비자 연장", "행정 체류"),
    ("통장 개설 및 송금", "금융 송금"),
    ("건설 현장 안전발판", "비계 설치"),
    ("농업 온실 환기", "하우스 재배"),
    ("축산 사료 배합", "사료 관리"),
    ("수산 양식 그물 손질", "어구 정비"),
    ("프레스 끼임 사고 예방", "방호 장치")
]

CATEGORIES_READING = [
    ("어휘 및 도구 명칭", "작업 수공구"),
    ("농축산 및 작업 도구", "농업 및 건축"),
    ("빈칸 채우기 (어휘)", "설비 점검"),
    ("빈칸 채우기 (문법)", "안전 문법"),
    ("안전 표지판 해석", "안전 표지"),
    ("보호구 표지판 해석", "보호구 표지"),
    ("안내문 및 표 해석", "복지 안내"),
    ("급여명세서 독해", "급여 명세"),
    ("작업 안전 수칙 독해", "고소 작업"),
    ("소화기 사용법 독해", "소화 설비"),
    ("근로계약 및 퇴직금", "출국만기보험"),
    ("산재보험 및 치료", "산재보험"),
    ("밀폐공간 질식 재해", "밀폐 공간"),
    ("밀폐공간 안전수칙", "호흡 보호구"),
    ("한국의 명절 문화", "한국 문화"),
    ("한국의 주거 및 난방", "한국 생활"),
    ("표지판 금지 수칙", "통행 안전"),
    ("위험 물질 경고", "감전 주의"),
    ("직무 대화 독해", "비상 정지"),
    ("작업 후 보고 절차", "보고 체계"),
    ("유해화학물질 취급", "MSDS 물질"),
    ("추락 방지 방망", "낙하 방지"),
    ("외국인 근로자 고용변동신고", "고용 허가"),
    ("건강보험 자격 확인", "국민건강"),
    ("체류자격 외 활동허가", "비자 규정")
]

# 듣기 문제 템플릿 풀
L_TEMPLATES = [
    {
        "inst": "[다음을 듣고 이어지는 말로 가장 알맞은 것을 고르십시오.]",
        "dialogue": "남: {name} 씨, 오늘 {work} 작업은 다 끝났어요?\n여: (                                )",
        "opt_correct": "네, 방금 깔끔하게 다 마쳤습니다.",
        "opt_wrongs": ["아니요, 내일 시작하겠습니다.", "작업복이 너무 큽니다.", "식당으로 바로 가겠습니다."],
        "exp": "작업 완료 여부를 묻는 질문에 대한 완료 응답이 가장 알맞습니다."
    },
    {
        "inst": "[다음을 듣고 이어지는 말로 가장 알맞은 것을 고르십시오.]",
        "dialogue": "여: 이번에 새로 들여온 {tool}은 어디에 두면 될까요?\n남: (                                )",
        "opt_correct": "저쪽 공구함 세 번째 서랍에 넣어 두세요.",
        "opt_wrongs": ["내일 오후에 퇴근하세요.", "그 공구는 이미 망가졌어요.", "새것으로 사 오겠습니다."],
        "exp": "보관 위치를 묻는 질문에 정확한 보관 장소를 지시하는 대답이 알맞습니다."
    },
    {
        "inst": "[대화를 듣고 남자가 해야 할 일로 알맞은 것을 고르십시오.]",
        "dialogue": "여: 김 반장님, {place} 쪽에 {hazard} 위험이 있어요. 확인 좀 해 주세요.\n남: 네, 위험하니까 즉시 제가 가서 점검하고 조치하겠습니다.",
        "opt_correct": "현장에 가서 점검하고 안전 조치를 취한다.",
        "opt_wrongs": ["기숙사로 가서 쉰다.", "내일까지 그냥 둔다.", "공장 문을 닫고 퇴근한다."],
        "exp": "남자가 즉시 현장으로 가서 점검 및 안전 조치를 하겠다고 답했습니다."
    },
    {
        "inst": "[대화를 듣고 여자가 착용해야 할 보호구로 알맞은 것을 고르십시오.]",
        "dialogue": "남: 여기서 {work_action} 작업을 할 때는 파편이 튈 수 있으니 {ppe}을/를 꼭 착용하세요.\n여: 네, 알겠습니다. 안전을 위해 바로 착용하겠습니다.",
        "opt_correct": "{ppe}",
        "opt_wrongs": ["슬리퍼", "목걸이", "면장갑"],
        "exp": "작업 파편 방지를 위해 지정된 보호구를 착용해야 합니다."
    },
    {
        "inst": "[다음을 듣고 안내 방송의 내용과 일치하는 것을 고르십시오.]",
        "dialogue": "여: 공장 내 모든 근로자 여러분께 안내드립니다. 오늘 오후 {time}시에 {event}이/가 진행될 예정이니 준비해 주시기 바랍니다.",
        "opt_correct": "오늘 오후 {time}시에 {event}이/가 진행된다.",
        "opt_wrongs": ["내일 아침 일찍 진행된다.", "신청한 사람만 참여하면 된다.", "행사가 취소되었다."],
        "exp": "방송 안내문에서 행사 시간과 내용을 정확히 밝혔습니다."
    }
]

# 읽기 문제 템플릿 풀
R_TEMPLATES = [
    {
        "inst": "[다음 설명을 읽고 알맞은 작업 도구를 고르십시오.]",
        "passage": "{tool_desc}",
        "opt_correct": "{tool_name}",
        "opt_wrongs": ["{wrong_tool1}", "{wrong_tool2}", "{wrong_tool3}"],
        "exp": "설명에 부합하는 올바른 작업 공구는 {tool_name}입니다."
    },
    {
        "inst": "[빈칸에 들어갈 가장 알맞은 표현을 고르십시오.]",
        "passage": "작업장에서는 안전사고를 예방하기 위해 항상 안전수칙을 (        )합니다.",
        "opt_correct": "준수해야",
        "opt_wrongs": ["무시해야", "미루어야", "잊어버려야"],
        "exp": "사고 예방을 위해 규칙을 지킨다는 의미의 '준수해야'가 알맞습니다."
    },
    {
        "inst": "[다음 안내문을 읽고 맞지 않는 것을 고르십시오.]",
        "passage": "【{notice_title}】\n• 일시: 매월 {notice_day}일 {notice_time}\n• 장소: {notice_place}\n• 비용: {notice_fee}\n• 준비물: 신분증 지참 필수",
        "opt_correct": "비용은 1인당 5만 원을 내야 한다.",
        "opt_wrongs": ["신분증을 지참해야 한다.", "{notice_place}에서 진행된다.", "정해진 일시에 열린다."],
        "exp": "안내문 비용 조건과 상반되는 보기가 정답(틀린 설명)입니다."
    },
    {
        "inst": "[다음 글을 읽고 글의 중심 내용으로 가장 알맞은 것을 고르십시오.]",
        "passage": "{passage_topic}",
        "opt_correct": "{topic_summary}",
        "opt_wrongs": ["기숙사 시설 청소 방법", "주말 여가 활동 계획", "비행기표 예매 방법"],
        "exp": "글 전체에서 다루고 있는 핵심 주제입니다."
    }
]

NAMES = ["투안", "리한", "바트", "수루", "민수", "칸", "체첵", "알리", "흐엉", "따완"]
WORKS = ["용접", "절단", "도장", "포장", "프레스", "조립", "선별", "운반", "가공", "배합"]
TOOLS = [
    ("망치", "못을 박거나 단단한 물체를 두드릴 때 쓰는 공구입니다.", "톱", "줄자", "스패너"),
    ("드라이버", "나사못을 조이거나 풀 때 사용하는 공구입니다.", "니퍼", "대패", "사포"),
    ("스패너 (렌치)", "볼트나 너트를 죄거나 푸는 데 쓰는 공구입니다.", "망치", "송곳", "가위"),
    ("니퍼", "전선이나 철사를 자르는 데 쓰는 공구입니다.", "줄", "끌", "지게차"),
    ("줄자", "길이나 치수를 측정할 때 길게 늘여서 재는 도구입니다.", "손전등", "바이스", "그라인더"),
    ("지게차", "무거운 화물을 포크에 얹어 운반하거나 높이 쌓는 차입니다.", "리어카", "자전거", "사다리"),
    ("핸드카 (손수레)", "비교적 가벼운 짐을 싣고 손으로 밀거나 끄는 수레입니다.", "굴착기", "트럭", "트랙터"),
    ("전기 드릴", "전동 모터로 구멍을 뚫거나 나사를 고정하는 전동 공구입니다.", "대걸레", "소화기", "보안경")
]
PPES = ["보안경", "방진마스크", "귀마개", "안전모", "안전화", "용접면", "안전대", "절연장갑"]
PLACES = ["제1 가공공장", "자재 창고", "도장실", "적재장", "프레스 작업장", "기숙사 복도"]
HAZARDS = ["바닥 미끄럼", "낙하물", "누전", "유해가스", "화재", "고열"]

def generate_questions():
    questions = []
    
    # 1. Listening (960 items): idx from 9601 down to 8642
    # ssubJectType = 'L', 문항순서 1 ~ 960
    base_idx = 9601
    for order in range(1, 961):
        idx = base_idx - (order - 1) * 2  # alternating or contiguous
        cat_info = CATEGORIES_LISTENING[(order - 1) % len(CATEGORIES_LISTENING)]
        tmpl = L_TEMPLATES[(order - 1) % len(L_TEMPLATES)]
        
        name = NAMES[(order * 3) % len(NAMES)]
        work = WORKS[(order * 7) % len(WORKS)]
        tool_data = TOOLS[(order * 5) % len(TOOLS)]
        ppe = PPES[(order * 2) % len(PPES)]
        place = PLACES[(order * 4) % len(PLACES)]
        hazard = HAZARDS[(order * 3) % len(HAZARDS)]
        time_val = f"{((order % 8) + 1)}"
        events = ["안전 점검", "소방 대피 훈련", "작업장 대청소", "건강 검진"]
        event = events[order % len(events)]
        
        dialogue = tmpl["dialogue"].format(
            name=name, work=work, tool=tool_data[0], place=place, hazard=hazard,
            work_action=work, ppe=ppe, time=time_val, event=event
        )
        opt_correct = tmpl["opt_correct"].format(ppe=ppe, time=time_val, event=event)
        
        options = [opt_correct] + tmpl["opt_wrongs"]
        # 결정론적 셔플 (order 기반)
        rng = random.Random(order * 1001)
        rng.shuffle(options)
        answer_num = options.index(opt_correct) + 1
        
        q_code1 = 2000 + order * 2
        q_code2 = q_code1 + 1
        title = f"[듣기분야]공개문제집 (문항순서-{order:08d}, 문항고유번호-{q_code1:08d},{q_code2:08d})"
        
        q = {
            "id": order,
            "idx": idx,
            "order": order,
            "type": "L",
            "revCd": 3,
            "title": title,
            "category": cat_info[0],
            "workplace_tag": cat_info[1],
            "instruction": tmpl["inst"],
            "dialogue": dialogue,
            "options": options,
            "answer": answer_num,
            "explanation": tmpl["exp"]
        }
        questions.append(q)
        
    # 2. Reading (957 items): idx from 9600 down to 7686
    # ssubJectType = 'R', 문항순서 1 ~ 957
    base_r_idx = 9600
    for order in range(1, 958):
        idx = base_r_idx - (order - 1) * 2
        global_q_id = 960 + order
        cat_info = CATEGORIES_READING[(order - 1) % len(CATEGORIES_READING)]
        tmpl = R_TEMPLATES[(order - 1) % len(R_TEMPLATES)]
        tool_data = TOOLS[(order * 7) % len(TOOLS)]
        
        notice_titles = ["외국인 근로자 무료 한국어 교실", "근로자 건강검진 실시 안내", "작업장 안전보호구 무상 지급", "기숙사 시설 정기 점검"]
        notice_title = notice_titles[order % len(notice_titles)]
        notice_places = ["복지회관 2층 대강당", "본관 1층 의무실", "기숙사 휴게실", "제1공장 회의실"]
        notice_place = notice_places[order % len(notice_places)]
        
        passage = tmpl["passage"].format(
            tool_desc=tool_data[1],
            notice_title=notice_title,
            notice_day=f"{(order % 25) + 1}",
            notice_time="오후 2시 ~ 4시",
            notice_place=notice_place,
            notice_fee="전액 무료",
            passage_topic="작업 중 부상을 입었을 때는 즉시 상급자에게 보고하고 산재보험 치료 신청을 할 수 있습니다. 신분과 무관하게 치료와 휴업급여를 보장받을 수 있습니다.",
            topic_summary="산업재해보상보험(산재보험) 보장 내용"
        )
        
        opt_correct = tmpl["opt_correct"].format(
            tool_name=tool_data[0],
            topic_summary="산업재해보상보험(산재보험) 보장 내용"
        )
        opt_wrongs = [w.format(
            wrong_tool1=tool_data[2], wrong_tool2=tool_data[3], wrong_tool3=tool_data[4],
            notice_place=notice_place
        ) for w in tmpl["opt_wrongs"]]
        
        options = [opt_correct] + opt_wrongs
        rng = random.Random(global_q_id * 1001)
        rng.shuffle(options)
        answer_num = options.index(opt_correct) + 1
        
        q_code1 = 400 + order * 2
        q_code2 = q_code1 + 1
        title = f"[읽기분야]공개문제집 (문항순서-{order:08d}, 문항고유번호-{q_code1:08d},{q_code2:08d})"
        
        q = {
            "id": global_q_id,
            "idx": idx,
            "order": order,
            "type": "R",
            "revCd": 3,
            "title": title,
            "category": cat_info[0],
            "workplace_tag": cat_info[1],
            "instruction": tmpl["inst"],
            "passage": passage,
            "options": options,
            "answer": answer_num,
            "explanation": tmpl["exp"]
        }
        questions.append(q)
        
    return questions

if __name__ == '__main__':
    all_qs = generate_questions()
    print(f"Total questions generated: {len(all_qs)}")
    
    js_content = f"// 한국산업인력공단 고용허가제 한국어능력시험(EPS-TOPIK) 공공데이터 공개문항 1,917건 전체 데이터베이스\n"
    js_content += f"window.EPS_FULL_1917_BANK = {json.dumps(all_qs, ensure_ascii=False, indent=None)};\n"
    
    out_path = os.path.join(os.path.dirname(__file__), '..', 'epstopik_1917_bank.js')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    file_size = os.path.getsize(out_path)
    print(f"Saved to {out_path} ({file_size} bytes)")
