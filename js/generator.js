window.addEventListener("DOMContentLoaded", () => {
    const CURATED_WISH_LINES = [
        "愿你在温柔的光里，听见最美的名字。",
        "愿你被爱包裹，如春日的花瓣轻轻落入掌心。",
        "愿你的笑容，成为我们永远愿意回望的风景。",
        "愿你在每个平凡日子，都被温暖和感谢轻轻绕梁。",
        "愿你花开的时刻，被温柔的目光悉心守护。",
        "愿你将疲惫放下，让每一次休憩都满是宠爱。",
        "愿你从不缺少被理解和被呵护的理由。",
        "愿每一个早晨，都有阳光为你绽放。",
        "愿你看见自己的美好，也被世界温柔以待。",
        "愿你在每一句问候里，收获满满的安心。",
        "愿你远离焦虑，拥有属于你的宁静花园。",
        "愿你把爱与被爱，悄悄写进生活的每一页。",
        "愿你一路被花香围绕，岁月也因此更加温柔。",
        "愿你在母亲节这一天，感受到最真挚的祝福。",
        "愿你的每一次付出，都被温柔地记住。",
        "愿你把今日的喜悦，留在心里最柔软的地方。",
        "愿你继续将家过成诗，也让自己常常被宠爱。"
    ];

    const CHAPTER_TITLES = {
        first: [
            "致母亲的晨光",
            "花开的祝词",
            "温柔序章",
            "柔软的告白"
        ],
        second: [
            "母亲节的回礼",
            "你是最温暖的信笺",
            "将爱写进每个日子",
            "让时间也温柔起来"
        ],
        third: [
            "永恒落款",
            "心语轻唱",
            "愿你被温柔拥抱",
            "绽放在这一刻"
        ]
    };

    const CURATED_ENDINGS = [
        "愿你这一天，像花一样温柔盛放。",
        "愿你的笑容，成为最美的母亲节礼物。",
        "愿你在未来的日子里，常常被幸福围绕。",
        "愿你把每一次付出，都换成值得的欢喜。"
    ];

    const CURATED_TAILS = [
        "在温柔的守候中静静绽放。",
        "让每一刻都变成温暖的纪念。",
        "把谢谢写成最柔软的言语。",
        "让这份感谢，永远留在心底。"
    ];

    const form = document.getElementById("wishForm");
    const sharePanel = document.getElementById("sharePanel");
    const generatedLinkInput = document.getElementById("generatedLink");
    const copyButton = document.getElementById("copyButton");
    const previewButton = document.getElementById("previewButton");
    const statusText = document.getElementById("statusText");
    const birthdayInput = document.getElementById("birthdayDate");
    const dateField = document.getElementById("dateField");
    const datePreview = document.getElementById("datePreview");
    const calendarTrigger = document.getElementById("calendarTrigger");
    const datePickerPanel = document.getElementById("datePickerPanel");
    const calendarPrev = document.getElementById("calendarPrev");
    const calendarNext = document.getElementById("calendarNext");
    const calendarMonthLabel = document.getElementById("calendarMonthLabel");
    const calendarGrid = document.getElementById("calendarGrid");
    const calendarToday = document.getElementById("calendarToday");
    const calendarClear = document.getElementById("calendarClear");

    let latestLink = "";
    let calendarYear = new Date().getFullYear();
    let calendarMonth = new Date().getMonth();

    if (!form || !sharePanel || !generatedLinkInput || !copyButton || !previewButton || !statusText || !birthdayInput || !dateField || !datePreview || !calendarTrigger || !datePickerPanel || !calendarPrev || !calendarNext || !calendarMonthLabel || !calendarGrid || !calendarToday || !calendarClear) {
        return;
    }

    function setStatus(message) {
        statusText.textContent = message;
    }

    function normalizeDateText(dateText) {
        const raw = String(dateText || "").trim();
        if (!raw) {
            return "";
        }

        const normalized = raw
            .replace(/[./]/g, "-")
            .replace(/年/g, "-")
            .replace(/月/g, "-")
            .replace(/日/g, "")
            .replace(/\s+/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const parts = normalized.split("-");
        if (parts.length !== 3) {
            return "";
        }

        const [year, month, day] = parts;
        if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day)) {
            return "";
        }

        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    function randomPick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function randomUnique(list, count) {
        const pool = [...list];
        const picked = [];
        const limit = Math.min(count, pool.length);
        for (let i = 0; i < limit; i += 1) {
            const index = Math.floor(Math.random() * pool.length);
            picked.push(pool[index]);
            pool.splice(index, 1);
        }
        return picked;
    }

    function uniqueKeepOrder(list) {
        const seen = new Set();
        const result = [];
        list.forEach((item) => {
            const key = String(item).trim();
            if (!key || seen.has(key)) {
                return;
            }
            seen.add(key);
            result.push(key);
        });
        return result;
    }

    function toLineKey(line) {
        return removeBlessingPrefix(String(line || ""))
            .replace(/[\s，。！？、；：,.!?:·|]/gu, "")
            .toLowerCase();
    }

    function buildUniqueBodyLines(candidates, requiredCount) {
        const selected = [];
        const used = new Set();

        candidates.forEach((line) => {
            if (selected.length >= requiredCount) {
                return;
            }
            const text = String(line || "").trim();
            if (!text) {
                return;
            }
            const key = toLineKey(text);
            if (!key || used.has(key)) {
                return;
            }
            used.add(key);
            selected.push(text);
        });

        while (selected.length < requiredCount) {
            const fallback = randomPick(CURATED_WISH_LINES) || "愿你此刻与未来，都有温暖回音。";
            const key = toLineKey(fallback);
            if (key && !used.has(key)) {
                used.add(key);
                selected.push(fallback);
            }
        }

        return selected;
    }

    function removeBlessingPrefix(text) {
        return text
            .replace(/^(愿你|愿|祝你|祝)\s*/u, "")
            .replace(/^[，。！？、；：,.!?:\s]+/u, "")
            .trim();
    }

    function extractWishFragments(rawText) {
        return rawText
            .split(/\r?\n|[，。！？；、,.!?:：]/)
            .map((line) => line.trim())
            .filter((line) => line.length > 1)
            .slice(0, 8);
    }

    function formatDateForPreview(dateText) {
        const normalizedDate = normalizeDateText(dateText);
        if (!normalizedDate) {
            return "尚未选择日期";
        }

        const date = new Date(`${normalizedDate}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return "尚未选择日期";
        }

        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${date.getFullYear()}年${month}月${day}日 · 母亲节温柔已点亮`;
    }

    function parseISODate(dateText) {
        const normalizedDate = normalizeDateText(dateText);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
            return null;
        }

        const date = new Date(`${normalizedDate}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function openCalendar() {
        const selected = parseISODate(birthdayInput.value);
        const base = selected || new Date();
        calendarYear = base.getFullYear();
        calendarMonth = base.getMonth();
        renderCalendar();
        datePickerPanel.hidden = false;
    }

    function closeCalendar() {
        datePickerPanel.hidden = true;
    }

    function renderCalendar() {
        calendarMonthLabel.textContent = `${calendarYear}年${String(calendarMonth + 1).padStart(2, "0")}月`;
        calendarGrid.innerHTML = "";

        const firstDay = new Date(calendarYear, calendarMonth, 1);
        const firstWeekDay = firstDay.getDay();
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const selectedText = normalizeDateText(birthdayInput.value);
        const todayText = formatDateForInput(new Date());

        for (let i = 0; i < firstWeekDay; i += 1) {
            const empty = document.createElement("div");
            empty.className = "calendar-day-empty";
            calendarGrid.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const dateText = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "calendar-day";
            if (dateText === selectedText) {
                dayButton.classList.add("is-selected");
            }
            if (dateText === todayText) {
                dayButton.classList.add("is-today");
            }
            dayButton.textContent = String(day);
            dayButton.addEventListener("click", () => {
                birthdayInput.value = dateText;
                refreshDateState();
                triggerDateBurst();
                closeCalendar();
            });
            calendarGrid.appendChild(dayButton);
        }
    }

    function ensureBlessingTone(fragment, starter) {
        if (!fragment) {
            return "";
        }

        const trimmed = String(fragment).trim();
        if (!trimmed) {
            return "";
        }

        // Normalize to a single blessing prefix and avoid cases like "愿你愿你...".
        const core = removeBlessingPrefix(trimmed);
        if (!core) {
            return `${starter}平安喜乐`;
        }

        if (/^(愿你|祝你)/u.test(trimmed)) {
            return `愿你${core}`;
        }

        if (/^(愿|祝)/u.test(trimmed)) {
            return `愿你${core}`;
        }

        return `${starter}${core}`;
    }

    function buildWishFromFragment(fragment) {
        const normalized = ensureBlessingTone(fragment, "愿你");
        const core = removeBlessingPrefix(normalized);
        const tail = randomPick(CURATED_TAILS);
        return `愿你${core}，${tail}`;
    }

    function composePoem({ name, age, birthday, signature, fragments }) {
        const safeFragments = fragments.length > 0 ? fragments : ["勇敢", "热爱", "闪光", "自由"];
        const generatedFromInput = safeFragments.slice(0, 5).map((item) => buildWishFromFragment(item));
        const randomFillers = randomUnique(CURATED_WISH_LINES, CURATED_WISH_LINES.length);
        const bodyLines = buildUniqueBodyLines(uniqueKeepOrder([...generatedFromInput, ...randomFillers]), 5);
        const displayDate = birthday.replace(/-/g, ".");
        const stanzaOneTitle = `第一章 | ${randomPick(CHAPTER_TITLES.first) || `致 ${name}`}`;
        const stanzaOneLine1 = bodyLines[0] || "愿你一路生花，在晨光里遇见答案。";
        const stanzaOneLine2 = bodyLines[1] || "愿你心有热爱，步履所至皆有回响。";

        const stanzaTwoTitle = `第二章 | ${randomPick(CHAPTER_TITLES.second) || "写给你"} · ${age}岁`;
        const stanzaTwoLine1 = bodyLines[2] || "愿你眼里有光，心里有海。";
        const stanzaTwoLine2 = bodyLines[3] || "愿你向前的时候，也被温柔照亮。";

        const stanzaThreeTitle = `第三章 | ${randomPick(CHAPTER_TITLES.third) || "星河落款"} · ${displayDate}`;
        const stanzaThreeLine1 = bodyLines[4] || `${displayDate}，愿这一天永远被温柔记住。`;
        const stanzaThreeLine2 = `${randomPick(CURATED_ENDINGS) || "愿你把今天的光带去更远的地方。"} 落款：${signature}`;

        return [
            stanzaOneTitle,
            stanzaOneLine1,
            stanzaOneLine2,
            stanzaTwoTitle,
            stanzaTwoLine1,
            stanzaTwoLine2,
            stanzaThreeTitle,
            stanzaThreeLine1,
            stanzaThreeLine2
        ];
    }

    function validateFormData(name, age, birthday, fragments, signature) {
        if (!name || name.length > 30) {
            return "请输入被祝福者姓名（1-30字）。";
        }

        const ageNumber = Number(age);
        if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 150) {
            return "年龄需为 1-150 的整数。";
        }

        if (!birthday) {
            return "请选择日期。";
        }

        const birthdayDate = parseISODate(birthday);
        if (!birthdayDate) {
            return "日期无效，请重新选择。";
        }

        const minDate = new Date("1900-01-01T00:00:00");
        const maxDate = new Date("2100-12-31T00:00:00");
        if (birthdayDate < minDate || birthdayDate > maxDate) {
            return "日期超出可用范围（1900-2100）。";
        }

        if (fragments.length < 2) {
            return "请输入至少两段心意关键词或短句。";
        }

        const fragmentTooLong = fragments.some((line) => line.length > 40);
        if (fragmentTooLong) {
            return "单条心意请控制在 40 字以内。";
        }

        if (!signature || signature.length > 40) {
            return "请输入落款（1-40字）。";
        }

        return "";
    }

    function buildWishUrl(data) {
        const wishUrl = new URL("wish.html", window.location.href);
        const params = new URLSearchParams();
        params.set("name", data.name);
        params.set("age", String(data.age));
        params.set("birthday", data.birthday);
        params.set("signature", data.signature);
        params.set("wishes", JSON.stringify(data.wishes));
        params.set("source", data.source || "mixed");
        wishUrl.search = params.toString();
        return wishUrl.toString();
    }

    async function copyLinkToClipboard(link) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(link);
            return true;
        }

        generatedLinkInput.focus();
        generatedLinkInput.select();
        generatedLinkInput.setSelectionRange(0, generatedLinkInput.value.length);
        return document.execCommand("copy");
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = (document.getElementById("recipientName")?.value || "").trim();
        const age = (document.getElementById("recipientAge")?.value || "").trim();
        const birthday = normalizeDateText((document.getElementById("birthdayDate")?.value || "").trim());
        const signature = (document.getElementById("signature")?.value || "").trim();
        const fragments = extractWishFragments((document.getElementById("wishLines")?.value || "").trim());

        const validationError = validateFormData(name, age, birthday, fragments, signature);
        if (validationError) {
            setStatus(validationError);
            previewButton.disabled = true;
            sharePanel.hidden = true;
            latestLink = "";
            return;
        }

        const poem = composePoem({
            name,
            age,
            birthday,
            signature,
            fragments
        });

        const link = buildWishUrl({
            name,
            age,
            birthday,
            signature,
            wishes: poem,
            source: "mixed"
        });

        // Keep URLs shareable across browsers and chat apps.
        if (link.length > 1800) {
            setStatus("内容过长，链接无法稳定分享。请精简祝福语后重试。");
            previewButton.disabled = true;
            sharePanel.hidden = true;
            latestLink = "";
            return;
        }

        latestLink = link;
        birthdayInput.value = birthday;
        generatedLinkInput.value = link;
        sharePanel.hidden = false;
        previewButton.disabled = false;
        setStatus("专属链接已生成，可直接复制并分享。");
    });

    function refreshDateState() {
        const formatted = formatDateForPreview(birthdayInput.value);
        datePreview.textContent = formatted;
        dateField.classList.toggle("is-active", birthdayInput.value.length > 0);
    }

    function triggerDateBurst() {
        dateField.classList.remove("is-burst");
        // Force reflow so repeated date changes can replay the burst animation.
        void dateField.offsetWidth;
        dateField.classList.add("is-burst");
    }

    birthdayInput.addEventListener("focus", () => {
        dateField.classList.add("is-active");
    });

    birthdayInput.addEventListener("input", refreshDateState);

    birthdayInput.addEventListener("change", () => {
        refreshDateState();
        if (normalizeDateText(birthdayInput.value)) {
            triggerDateBurst();
        }
    });
    birthdayInput.addEventListener("blur", () => {
        const normalized = normalizeDateText(birthdayInput.value);
        if (normalized) {
            birthdayInput.value = normalized;
            triggerDateBurst();
        }
        refreshDateState();
    });

    calendarTrigger.addEventListener("click", () => {
        if (datePickerPanel.hidden) {
            openCalendar();
        } else {
            closeCalendar();
        }
    });

    calendarPrev.addEventListener("click", () => {
        calendarMonth -= 1;
        if (calendarMonth < 0) {
            calendarMonth = 11;
            calendarYear -= 1;
        }
        renderCalendar();
    });

    calendarNext.addEventListener("click", () => {
        calendarMonth += 1;
        if (calendarMonth > 11) {
            calendarMonth = 0;
            calendarYear += 1;
        }
        renderCalendar();
    });

    calendarToday.addEventListener("click", () => {
        const todayText = formatDateForInput(new Date());
        birthdayInput.value = todayText;
        refreshDateState();
        triggerDateBurst();
        renderCalendar();
    });

    calendarClear.addEventListener("click", () => {
        birthdayInput.value = "";
        refreshDateState();
        renderCalendar();
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (!dateField.contains(target) && !datePickerPanel.hidden) {
            closeCalendar();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !datePickerPanel.hidden) {
            closeCalendar();
        }
    });

    refreshDateState();

    copyButton.addEventListener("click", async () => {
        if (!latestLink) {
            setStatus("请先生成链接。");
            return;
        }

        try {
            const copied = await copyLinkToClipboard(latestLink);
            setStatus(copied ? "链接已复制。" : "复制失败，请手动复制输入框中的链接。");
        } catch (error) {
            setStatus("复制失败，请手动复制输入框中的链接。");
        }
    });

    previewButton.addEventListener("click", () => {
        if (!latestLink) {
            setStatus("请先生成链接。");
            return;
        }
        window.location.href = latestLink;
    });
});
