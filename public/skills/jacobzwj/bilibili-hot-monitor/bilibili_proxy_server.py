#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
B站 AI 总结代理服务器

部署在中国大陆服务器上，为海外服务器提供 B站 AI 总结 API 代理。

使用方法：
    1. 安装依赖：pip install flask requests
    2. 运行服务：python bilibili_proxy_server.py
    3. 服务默认运行在 http://0.0.0.0:5000

API 端点：
    GET /bilibili/ai_summary?bvid=xxx&cid=xxx&up_mid=xxx&cookies=xxx
"""

import hashlib
import time
import urllib.parse
from functools import reduce

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

# ==================== B站 API 相关代码 ====================

# WBI 混淆表
MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
    27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
    37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
    22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52
]


def get_mixin_key(orig: str) -> str:
    """生成 mixin_key"""
    return reduce(lambda s, i: s + orig[i], MIXIN_KEY_ENC_TAB, '')[:32]


def enc_wbi(params: dict, img_key: str, sub_key: str) -> dict:
    """WBI 签名"""
    mixin_key = get_mixin_key(img_key + sub_key)
    curr_time = round(time.time())
    params['wts'] = curr_time
    params = dict(sorted(params.items()))
    params = {
        k: ''.join(filter(lambda x: x not in "!'()*", str(v)))
        for k, v in params.items()
    }
    query = urllib.parse.urlencode(params)
    wbi_sign = hashlib.md5((query + mixin_key).encode()).hexdigest()
    params['w_rid'] = wbi_sign
    return params


def get_wbi_keys(session: requests.Session) -> tuple[str, str]:
    """获取 WBI 密钥"""
    resp = session.get('https://api.bilibili.com/x/web-interface/nav')
    data = resp.json()
    
    img_url = data['data']['wbi_img']['img_url']
    sub_url = data['data']['wbi_img']['sub_url']
    
    img_key = img_url.rsplit('/', 1)[1].split('.')[0]
    sub_key = sub_url.rsplit('/', 1)[1].split('.')[0]
    
    return img_key, sub_key


def parse_cookies(cookie_str: str) -> dict:
    """解析 cookies 字符串为字典"""
    cookies = {}
    for item in cookie_str.split(';'):
        item = item.strip()
        if '=' in item:
            key, value = item.split('=', 1)
            cookies[key.strip()] = value.strip()
    return cookies


def get_ai_summary(bvid: str, cid: int, up_mid: int, cookies_str: str) -> dict | None:
    """
    获取 B站 AI 总结
    
    Args:
        bvid: 视频 BV 号
        cid: 视频 cid
        up_mid: UP主 mid
        cookies_str: B站 cookies 字符串
    
    Returns:
        AI 总结数据
    """
    # 创建会话
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.bilibili.com",
        "Origin": "https://www.bilibili.com",
    })
    
    # 设置 cookies
    cookies = parse_cookies(cookies_str)
    for key, value in cookies.items():
        session.cookies.set(key, value)
    
    # 获取 WBI 密钥
    try:
        img_key, sub_key = get_wbi_keys(session)
    except Exception as e:
        print(f"获取 WBI 密钥失败: {e}")
        return None
    
    # 构造请求参数
    params = {
        "bvid": bvid,
        "cid": cid,
        "up_mid": up_mid,
        "web_location": "333.788",
    }
    
    # WBI 签名
    signed_params = enc_wbi(params, img_key, sub_key)
    
    # 请求 AI 总结
    headers = {
        "Origin": "https://www.bilibili.com",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    }
    
    try:
        resp = session.get(
            "https://api.bilibili.com/x/web-interface/view/conclusion/get",
            params=signed_params,
            headers=headers,
            timeout=10,
        )
        data = resp.json()
        
        if data["code"] != 0:
            print(f"B站 API 错误: {data['message']}")
            return None
        
        return data["data"]
    except Exception as e:
        print(f"请求 AI 总结失败: {e}")
        return None


# ==================== Flask API ====================

@app.route('/bilibili/ai_summary')
def api_get_ai_summary():
    """
    获取 B站 AI 总结的 API 端点
    
    参数:
        bvid: 视频 BV 号
        cid: 视频 cid
        up_mid: UP主 mid
        cookies: B站 cookies 字符串
    """
    bvid = request.args.get('bvid')
    cid = request.args.get('cid')
    up_mid = request.args.get('up_mid')
    cookies = request.args.get('cookies')
    
    if not all([bvid, cid, up_mid, cookies]):
        return jsonify({"error": "缺少参数"}), 400
    
    try:
        cid = int(cid)
        up_mid = int(up_mid)
    except ValueError:
        return jsonify({"error": "cid 和 up_mid 必须是整数"}), 400
    
    result = get_ai_summary(bvid, cid, up_mid, cookies)
    
    if result is None:
        return jsonify({"error": "获取 AI 总结失败"}), 500
    
    return jsonify(result)


@app.route('/health')
def health_check():
    """健康检查端点"""
    return jsonify({"status": "ok", "message": "B站代理服务运行中"})


if __name__ == '__main__':
    print("=" * 60)
    print("B站 AI 总结代理服务器")
    print("=" * 60)
    print("API 端点: /bilibili/ai_summary")
    print("健康检查: /health")
    print("=" * 60)
    
    # 运行服务（监听所有 IP，端口 5000）
    app.run(host='0.0.0.0', port=5000, debug=False)
