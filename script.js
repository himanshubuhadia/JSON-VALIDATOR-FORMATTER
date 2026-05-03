const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');
const statusBar = document.getElementById('status-bar');


function processJSON() {
    const rawData = jsonInput.value.trim();
    if (!rawData) {
        hideStatus();
        jsonOutput.textContent = "";
        return;
    }

    try {
        const parsed = JSON.parse(rawData);
        
        
        jsonOutput.textContent = JSON.stringify(parsed, null, 4);
        
        showStatus('<i class="fas fa-check-circle"></i> Valid JSON! Successfully formatted.', "success");
        jsonInput.style.borderColor = "var(--primary)";
    } catch (err) {
        jsonOutput.textContent = "";
        // Extract browser-provided error message[cite: 2, 12]
        showStatus('<i class="fas fa-triangle-exclamation"></i> Invalid JSON: ' + err.message, "error");
        jsonInput.style.borderColor = "var(--danger)";
    }
}


function showStatus(htmlContent, type) {
    statusBar.innerHTML = htmlContent;
    statusBar.className = `status-bar ${type}`;
    statusBar.classList.remove('hidden');
}

function hideStatus() {
    statusBar.classList.add('hidden');
    jsonInput.style.borderColor = "var(--border)";
}


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


document.getElementById('download-btn').addEventListener('click', () => {
    const content = jsonOutput.textContent;
    if (!content) return alert("Nothing to download. Please provide valid JSON first.");
    
    const blob = new Blob([content], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted_data.json';
    a.click();
    URL.revokeObjectURL(url);
});


document.getElementById('copy-btn').addEventListener('click', () => {
    const content = jsonOutput.textContent;
    if (!content) return;
    
    navigator.clipboard.writeText(content).then(() => {
        const btn = document.getElementById('copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = originalHTML, 2000);
    });
});


document.getElementById('validate-btn').addEventListener('click', processJSON);

document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('theme-icon');
    
    if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

document.getElementById('clear-btn').addEventListener('click', () => {
    jsonInput.value = "";
    jsonOutput.textContent = "";
    hideStatus();
});


let timer;
jsonInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(processJSON, 500);
});
