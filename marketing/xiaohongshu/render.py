#!/usr/bin/env python3
"""把這個資料夾裡的小紅書封面 HTML 渲染成 1242×1656 PNG。

用法：python3 render.py            # 全部重畫
      python3 render.py xxx.html   # 只畫指定檔

需要：pip install playwright，且系統要有 Noto Sans TC / Archivo（見 README）。
"""
import glob
import os
import sys

from playwright.sync_api import sync_playwright

W, H = 1242, 1656  # 小紅書直式 3:4
HERE = os.path.dirname(os.path.abspath(__file__))


def find_chrome():
    for pat in (
        "/opt/pw-browsers/chromium*/chrome-linux/chrome",
        "/opt/pw-browsers/chromium*/chrome-linux/headless_shell",
    ):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None  # 讓 playwright 用它自己下載的那份


def main():
    targets = sys.argv[1:] or sorted(glob.glob(os.path.join(HERE, "*-cover*.html")))
    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            executable_path=find_chrome(),
            args=["--no-sandbox", "--font-render-hinting=none"],
        )
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for src in targets:
            src = os.path.abspath(src)
            out = os.path.splitext(src)[0] + ".png"
            page.goto("file://" + src)
            page.wait_for_timeout(800)  # 等字體與圖片
            page.screenshot(path=out)
            print(f"{os.path.basename(out)}  {os.path.getsize(out) // 1024} KB")
        browser.close()


if __name__ == "__main__":
    main()
