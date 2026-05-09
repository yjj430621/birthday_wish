(() => {
    const defaults = {
        name: "亲爱的妈妈",
        age: 45,
        signature: "永远爱你的孩子",
        lead: "母亲节快乐，愿你被温柔和感谢围绕。",
        birthday: "2026-05-10",
        sections: [
            "你用岁月编织温柔的港湾，陪我走过风雨。",
            "你是世间最美的坚持，细水流年里静静守护。",
            "母亲节的花朵为你绽放，愿你每天都被爱拥抱。",
            "感谢你用笑容点亮平凡时光，让家永远有光。",
            "愿你的每一个明天都比今天更轻松、更快乐。",
            "愿这一天成为属于你的温暖礼赞。",
            "无论我走多远，心中最深的名字永远是你。",
            "愿你被温柔以待，愿你笑容如初。",
            "落款：永远爱你的孩子。"
        ]
    };

    const MAX_LENGTH = {
        name: 30,
        signature: 40,
        line: 80
    };

    function safeText(value, maxLen) {
        const text = typeof value === "string" ? value.trim() : "";
        return text.slice(0, maxLen);
    }

    function parseQueryParams() {
        const searchParams = new URLSearchParams(window.location.search);
        if ([...searchParams.keys()].length > 0) {
            return searchParams;
        }

        const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
        return new URLSearchParams(hash);
    }

    function parseWishLines(rawWishes) {
        if (!rawWishes) {
            return [];
        }

        try {
            const parsed = JSON.parse(rawWishes);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed.map((line) => safeText(String(line), MAX_LENGTH.line)).filter(Boolean).slice(0, 9);
        } catch (error) {
            console.warn("Invalid wishes payload. Falling back to defaults.");
            return [];
        }
    }

    function parseBirthday(rawBirthday) {
        if (!rawBirthday || !/^\d{4}-\d{2}-\d{2}$/.test(rawBirthday)) {
            return "";
        }

        const date = new Date(`${rawBirthday}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const minDate = new Date("1900-01-01T00:00:00");
        const maxDate = new Date("2100-12-31T00:00:00");
        if (date < minDate || date > maxDate) {
            return "";
        }

        return rawBirthday;
    }

    function toOrdinal(age) {
        const mod10 = age % 10;
        const mod100 = age % 100;
        if (mod10 === 1 && mod100 !== 11) return `${age}st`;
        if (mod10 === 2 && mod100 !== 12) return `${age}nd`;
        if (mod10 === 3 && mod100 !== 13) return `${age}rd`;
        return `${age}th`;
    }

    function render() {
        const params = parseQueryParams();

        const name = safeText(params.get("name") || defaults.name, MAX_LENGTH.name) || defaults.name;
        const ageInput = Number(params.get("age"));
        const age = Number.isInteger(ageInput) && ageInput > 0 && ageInput <= 150 ? ageInput : defaults.age;
        const birthday = parseBirthday(params.get("birthday") || "");
        const signature = safeText(params.get("signature") || "", MAX_LENGTH.signature);
        const lines = parseWishLines(params.get("wishes"));
        const source = safeText(params.get("source") || "mixed", 20);

        const lead = lines[1] || defaults.lead;
        const signatureLine = lines[8] || (signature ? `落款：${signature}` : defaults.signature);

        const sectionFallback = [
            defaults.sections[0],
            defaults.sections[1],
            defaults.sections[2],
            defaults.sections[3],
            defaults.sections[4],
            birthday ? `${birthday}，愿这一天永远被温柔记住。` : defaults.sections[5],
            defaults.sections[6],
            defaults.sections[7],
            defaults.sections[8]
        ];

        const sectionValues = sectionFallback.map((fallback, index) => lines[index] || fallback);

        const nodeMap = {
            wishRecipient: name,
            wishHeadline: `Happy Mother's Day!`,
            wishLead: lead,
            wishSignatureLine: signatureLine,
            section1Title: sectionValues[0],
            section1Line1: sectionValues[1],
            section1Line2: sectionValues[2],
            section2Title: sectionValues[3],
            section2Line1: sectionValues[4],
            section2Line2: sectionValues[5],
            section3Title: sectionValues[6],
            section3Line1: sectionValues[7],
            section3Line2: sectionValues[8]
        };

        Object.entries(nodeMap).forEach(([id, value]) => {
            const target = document.getElementById(id);
            if (target) {
                target.textContent = value;
            }
        });

        const ageBadge = document.getElementById("wishAgeBadge");
        if (ageBadge) {
            ageBadge.textContent = `${age} 岁温情章`;
        }

        const dateBadge = document.getElementById("wishDateBadge");
        if (dateBadge) {
            const birthdayText = birthday || defaults.birthday;
            dateBadge.textContent = `母亲节：${birthdayText.replace(/-/g, ".")}`;
        }

        const sourceBadge = document.getElementById("wishSourceBadge");
        if (sourceBadge) {
            sourceBadge.textContent = source === "mixed" ? "模板：诗意混合生成" : "模板：经典祝福渲染";
        }

        document.title = `${name} - Happy Mother's Day`;
    }

    window.addEventListener("DOMContentLoaded", render);
})();
