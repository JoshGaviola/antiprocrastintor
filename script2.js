// --- Semantic Similarity AI ---

    console.log("script2.js loaded!");
    console.log(document.getElementById('tab-similarity-loading'));

let generateEmbedding = null;
let modelLoading = false;

async function initializeModel() {
    const loadingElement = document.getElementById('tab-similarity-loading');
    if (generateEmbedding || modelLoading) return;
    modelLoading = true;
    console.log("Am I working?");
    if (loadingElement) loadingElement.style.display = 'block';
    try {
        const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.1');
        generateEmbedding = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model:", error);
        alert("Failed to load the AI model. Please check your internet connection and try again.");
    } finally {
        modelLoading = false;
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

function cosineSimilarity(vec1, vec2) {
    let dot = 0, norm1 = 0, norm2 = 0;
    for (let i = 0; i < vec1.length; i++) {
        dot += vec1[i] * vec2[i];
        norm1 += vec1[i] * vec1[i];
        norm2 += vec2[i] * vec2[i];
    }
    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);
    return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
}

async function compareTaskWithTabs(currentTask) {
    const loadingElement = document.getElementById('tab-similarity-loading');
    const resultElement = document.getElementById('tab-task-similarity');
    if (!loadingElement || !resultElement) return;

    // Show loading
    loadingElement.style.display = 'block';
    resultElement.style.display = 'none';

    await initializeModel();

    // Get tab titles from the injected list
    const tabLinks = document.querySelectorAll('#tabs ul li a');
    const tabTitles = Array.from(tabLinks).map(link => link.textContent);

    if (!currentTask || tabTitles.length === 0) {
        loadingElement.style.display = 'none';
        resultElement.style.display = 'none';
        return;
    }

    // Get embeddings
    try {
        const sentences = [currentTask, ...tabTitles];
        const embeddings = await Promise.all(
            sentences.map(s => generateEmbedding(s, { pooling: 'mean', normalize: true }))
        );
        const taskEmbedding = embeddings[0].data;
        const results = [];

        for (let i = 1; i < embeddings.length; i++) {
            const sim = cosineSimilarity(taskEmbedding, embeddings[i].data);
            results.push({ title: tabTitles[i - 1], similarity: sim });
        }

        // Display results
        let resultHtml = '<div style="margin-bottom:10px;"><strong>Task vs Tab Similarity:</strong></div>';
        results.forEach(r => {
            resultHtml += `<div style="margin-bottom:4px;">"${currentTask}" vs "<span style="color:#007bff">${r.title}</span>": <b>${(r.similarity * 100).toFixed(1)}%</b></div>`;
        });

        resultElement.innerHTML = resultHtml;
        resultElement.style.display = 'block';
    } catch (error) {
        resultElement.innerHTML = '<div style="color:red;">Error comparing task and tabs.</div>';
        resultElement.style.display = 'block';
        console.error(error);
    } finally {
        loadingElement.style.display = 'none';
    }
}

function hookTaskButtons() {
    document.querySelectorAll('.task-item .btn').forEach(btn => {
        if (!btn._similarityHooked) {
            btn._similarityHooked = true;
            btn.addEventListener('click', async function() {
                const taskName = this.closest('.task-item').querySelector('span').textContent;
                await compareTaskWithTabs(taskName);
            });
        }
    });
}

// Initial hook
hookTaskButtons();

// Observe for new tasks added dynamically
const taskList = document.getElementById('task-list');
if (taskList) {
    const observer = new MutationObserver(hookTaskButtons);
    observer.observe(taskList, { childList: true, subtree: true });
}

// Initialize the model immediately after the website is opened
initializeModel();