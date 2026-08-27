const editor = document.getElementById("editor");

const keys = [...document.querySelectorAll(".key")];

let caps = false;
let shift = false;

const shifted = {
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")",
    "-": "_",
    "=": "+",
    "[": "{",
    "]": "}",
    "\\": "|",
    ";": ":",
    "'": '"',
    ",": "<",
    ".": ">",
    "/": "?"
};

const specialMap = {
    "`": "`"
};

function insertText(text) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    editor.value =
        editor.value.slice(0, start) +
        text +
        editor.value.slice(end);

    editor.selectionStart =
        editor.selectionEnd =
        start + text.length;

    updateStats();

    editor.focus();
}

function backspace() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    if (start !== end) {
        editor.value =
            editor.value.slice(0, start) +
            editor.value.slice(end);

        editor.selectionStart =
            editor.selectionEnd =
            start;
    } else if (start > 0) {
        editor.value =
            editor.value.slice(0, start - 1) +
            editor.value.slice(start);

        editor.selectionStart =
            editor.selectionEnd =
            start - 1;
    }

    updateStats();

    editor.focus();
}

function handleKey(key) {
    if (key === "BACKSPACE") {
        backspace();
        return;
    }

    if (key === "ENTER") {
        insertText("\n");
        return;
    }

    if (key === "TAB") {
        insertText("\t");
        return;
    }

    if (key === "CAPS") {
        caps = !caps;
        updateCaps();
        return;
    }

    if (key === "SHIFT") {
        shift = !shift;
        flashModifier("SHIFT");
        return;
    }

    if (key === "CTRL" || key === "ALT") {
        flashModifier(key);
        return;
    }

    let out = key;

    if (key === " ") {
        insertText(" ");
        return;
    }

    if (key.length === 1) {
        if (
            shift &&
            shifted[key] !== undefined
        ) {
            out = shifted[key];
        } else if (
            caps &&
            /[a-z]/i.test(key)
        ) {
            out = key.toUpperCase();
        } else if (
            !caps &&
            /[a-z]/i.test(key)
        ) {
            out = key.toLowerCase();
        }
    }

    insertText(out);

    if (shift) {
        shift = false;
    }

    updateCaps();
}

function updateCaps() {
    document
        .getElementById("capsKey")
        .classList.toggle("caps-on", caps);

    keys
        .filter(
            k =>
                k.dataset.key &&
                k.dataset.key.length === 1 &&
                /[a-z]/i.test(k.dataset.key)
        )
        .forEach(k => {
            k.textContent = caps
                ? k.dataset.key.toUpperCase()
                : k.dataset.key.toUpperCase();
        });
}

function flashModifier(key) {
    const el = keys.find(
        k => k.dataset.key === key
    );

    if (!el) {
        return;
    }

    el.classList.add("active");

    setTimeout(
        () => el.classList.remove("active"),
        120
    );
}

function flashKey(key) {
    const el =
        keys.find(
            k => k.dataset.key === key
        ) ||
        keys.find(
            k =>
                k.dataset.key ===
                key.toLowerCase()
        );

    if (el) {
        el.classList.add("active");

        setTimeout(
            () => el.classList.remove("active"),
            90
        );
    }
}

keys.forEach(key => {
    key.addEventListener(
        "click",
        () => handleKey(key.dataset.key)
    );
});

document.addEventListener("keydown", e => {
    const key = e.key;

    if (e.key === "CapsLock") {
        e.preventDefault();

        caps = !caps;

        updateCaps();
        flashKey("CAPS");

        return;
    }

    if (e.key === "Shift") {
        shift = true;
        flashKey("SHIFT");
        return;
    }

    if (e.key === "Control") {
        flashKey("CTRL");
        return;
    }

    if (e.key === "Alt") {
        flashKey("ALT");
        return;
    }

    if (e.key === "Backspace") {
        flashKey("BACKSPACE");
        return;
    }

    if (e.key === "Enter") {
        flashKey("ENTER");
        return;
    }

    if (e.key === "Tab") {
        flashKey("TAB");
        return;
    }

    if (e.key === " ") {
        flashKey(" ");
        return;
    }

    if (key.length === 1) {
        flashKey(key.toLowerCase());
    }
});

document.addEventListener("keyup", e => {
    if (e.key === "Shift") {
        shift = false;
    }
});

editor.addEventListener("input", updateStats);

function updateStats() {
    const text = editor.value;

    document.getElementById("charCount").textContent =
        `${text.length} character${text.length === 1 ? "" : "s"}`;

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    document.getElementById("wordCount").textContent =
        `${words} word${words === 1 ? "" : "s"}`;
}

function clearText() {
    editor.value = "";

    updateStats();

    editor.focus();
}

updateCaps();
updateStats();