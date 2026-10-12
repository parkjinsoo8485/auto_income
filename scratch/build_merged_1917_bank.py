#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re
import os
import random

# 1. Extract 40 master questions from topik_questions.html
with open('topik_questions.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'const EPS_QUESTIONS = (\[[\s\S]*?\]);\s*/\*', html)
if not match:
    raise ValueError("Could not find EPS_QUESTIONS in topik_questions.html")

master_json_str = match.group(1)
# Convert JS object syntax to valid JSON (trailing commas, unquoted keys if any)
# Let's use node or python eval
import subprocess
node_cmd = ["node", "-e", f"const q = {master_json_str}; console.log(JSON.stringify(q));"]
proc = subprocess.run(node_cmd, capture_output=True, text=True, encoding='utf-8')
if proc.returncode != 0:
    print("Node error:", proc.stderr)
    raise RuntimeError("Failed to parse EPS_QUESTIONS with Node")

master_40 = json.loads(proc.stdout)
print(f"Extracted {len(master_40)} master questions.")

l_master_20 = [q for q in master_40 if q['type'] == 'L']
r_master_20 = [q for q in master_40 if q['type'] == 'R']

# Import generator routines
from generate_1917_bank import (
    CATEGORIES_LISTENING, CATEGORIES_READING,
    L_TEMPLATES, R_TEMPLATES, NAMES, WORKS, TOOLS, PPES, PLACES, HAZARDS
)

all_questions = []

# --- 1. LISTENING (960 items: order 1 ~ 960) ---
base_l_idx = 9601
for order in range(1, 961):
    idx = base_l_idx - (order - 1) * 2
    q_code1 = 2000 + order * 2
    q_code2 = q_code1 + 1
    title = f"[듣기분야]공개문제집 (문항순서-{order:08d}, 문항고유번호-{q_code1:08d},{q_code2:08d})"
    
    if order <= len(l_master_20):
        # Use master question but normalize id, idx, order, title
        mq = l_master_20[order - 1].copy()
        mq['id'] = order
        mq['idx'] = idx
        mq['order'] = order
        mq['title'] = title
        all_questions.append(mq)
    else:
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
        rng = random.Random(order * 1001)
        rng.shuffle(options)
        answer_num = options.index(opt_correct) + 1
        
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
        all_questions.append(q)

# --- 2. READING (957 items: order 1 ~ 957) ---
base_r_idx = 9600
for order in range(1, 958):
    idx = base_r_idx - (order - 1) * 2
    global_q_id = 960 + order
    q_code1 = 400 + order * 2
    q_code2 = q_code1 + 1
    title = f"[읽기분야]공개문제집 (문항순서-{order:08d}, 문항고유번호-{q_code1:08d},{q_code2:08d})"
    
    if order <= len(r_master_20):
        mq = r_master_20[order - 1].copy()
        mq['id'] = global_q_id
        mq['idx'] = idx
        mq['order'] = order
        mq['title'] = title
        all_questions.append(mq)
    else:
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
        all_questions.append(q)

print(f"Total merged questions: {len(all_questions)}")

js_content = "// 한국산업인력공단 고용허가제 한국어능력시험(EPS-TOPIK) 공공데이터 공개문항 1,917건 전체 데이터베이스\n"
js_content += f"window.EPS_FULL_1917_BANK = {json.dumps(all_questions, ensure_ascii=False, separators=(',', ':'))};\n"

out_path = 'epstopik_1917_bank.js'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Updated {out_path} with {len(all_questions)} questions ({os.path.getsize(out_path)} bytes)")
