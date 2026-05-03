const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');
const statusBar = document.getElementById('status-bar');

// 1. CORE VALIDATION AND FORMATTING LOGIC
function processJSON() {
    const rawData = jsonInput.value.trim();
    if (!rawData) {
        hideStatus();
        jsonOutput.textContent = "";
        return;
    }

    try {
        // Attempt to parse the text[cite: 2, 7]
        const parsed = JSON.parse(rawData);
        
        // Format the object back to a string with 4-space indentation[cite: 2, 7]
        jsonOutput.textContent = JSON.stringify(parsed, null, 4);
        
        showStatus("✓ Valid JSON Format", "success");
        jsonInput.style.borderColor = "var(--primary)";
    } catch (err) {
        jsonOutput.textContent = "";
        // Show specific syntax error message[cite: 2, 7]
        showStatus("✖ " + err.message, "error");
        jsonInput.style.borderColor = "#dc2626";
    }
}

// 2. STATUS MESSAGE HANDLING
function showStatus(msg, type) {
    statusBar.textContent = msg;
    statusBar.className = `status-bar ${type}`;
    statusBar.classList.remove('hidden');
}

function hideStatus() {
    statusBar.classList.add('hidden');
    jsonInput.style.borderColor = "var(--border)";
}

// 3. FILE UPLOAD LOGIC
document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        jsonInput.value = event.target.result;
        processJSON();
    };
    reader.readAsText(file);
});

// 4. DOWNLOAD LOGIC
document.getElementById('download-btn').addEventListener('click', () => {
    const content = jsonOutput.textContent;
    if (!content) return alert("Nothing to download. Provide valid JSON first.");
    
    const blob = new Blob([content], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted_data.json';
    a.click();
});

// 5. COPY TO CLIPBOARD
document.getElementById('copy-btn').addEventListener('click', () => {
    const content = jsonOutput.textContent;
    if (!content) return;
    
    navigator.clipboard.writeText(content).then(() => {
        const btn = document.getElementById('copy-btn');
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => btn.innerText = originalText, 2000);
    });
});

// 6. EVENT LISTENERS FOR THEME AND ACTIONS[cite: 7]
document.getElementById('validate-btn').addEventListener('click', processJSON);

document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    document.getElementById('theme-toggle').innerText = isDark ? "☀️" : "🌙";
});

document.getElementById('clear-btn').addEventListener('click', () => {
    jsonInput.value = "";
    jsonOutput.textContent = "";
    hideStatus();
});

// Real-time validation (Bonus feature)
jsonInput.addEventListener('input', () => {
    if (jsonInput.value.length > 0) {
        // Optional: you could call processJSON() here for real-time validation
    }
});