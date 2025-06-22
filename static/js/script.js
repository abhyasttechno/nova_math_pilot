// Add Practice Check Modal elements (Check these carefully)
const hintsSection = document.getElementById('hints-section');
const hintMessage = document.getElementById('hint-message');
const currentHintOutput = document.getElementById('current-hint-output');
const iSolvedItButton = document.getElementById('i-solved-it-button'); // Using button for confirmation
const hintConfirmationDropdownElement = document.getElementById('hintConfirmationDropdown');// Uncomment if using dropdown
const nextHintButton = document.getElementById('next-hint-button');



const practiceCheckModalElement = document.getElementById('practiceCheckModal');
const practiceCheckModal = new bootstrap.Modal(practiceCheckModalElement); // Initialize Bootstrap Modal instance
const modalPracticeProblemContent = document.getElementById('modalPracticeProblemContent');
const practiceCheckForm = document.getElementById('practiceCheckForm');
const practiceSolutionFile = document.getElementById('practiceSolutionFile');
const practiceSelectedFileInfo = document.getElementById('practiceSelectedFileInfo');
const modalPracticeProblemTextHidden = document.getElementById('modalPracticeProblemTextHidden');
const submitPracticeCheckButton = document.getElementById('submitPracticeCheckButton');
const practiceCheckResult = document.getElementById('practiceCheckResult');
const practiceCheckOutput = document.getElementById('practiceCheckOutput');
const practiceModalAlertBox = document.getElementById('practiceModalAlertBox');

// Concepts & Refresher Section Elements (using new card ID)
const conceptsRefresherSection = document.getElementById('concepts-refresher-card'); // Updated ID
const identifiedConceptsList = document.getElementById('identifiedConceptsList');
const quickRefresherButton = document.getElementById('quickRefresherButton');
const conceptsRefresherAlert = document.getElementById('conceptsRefresherAlert');

// Refresher Modal elements
const refresherModalElement = document.getElementById('refresherModal');
const refresherModal = new bootstrap.Modal(refresherModalElement);
const refresherModalLabel = document.getElementById('refresherModalLabel');
const refresherContent = document.getElementById('refresherContent');
const refresherExample = document.getElementById('refresherExample');
const refresherConceptDescription = document.getElementById('refresherConceptDescription');
const refresherSolvedQuestions = document.getElementById('refresherSolvedQuestions');
const refresherLoadingSpinner = document.getElementById('refresherLoadingSpinner');
const refresherError = document.getElementById('refresherError');

// --- API Endpoints ---
// const API_BASE_URL = 'https://novamaths-api-edfd27612b5d.herokuapp.com';
const API_BASE_URL = 'http://127.0.0.1:8080';
const SOLVE_API_ENDPOINT = `${API_BASE_URL}/solve-math`;
const CLARIFY_API_ENDPOINT = `${API_BASE_URL}/clarify-step`;
const PRACTICE_API_ENDPOINT = `${API_BASE_URL}/practice`;
const AMA_API_ENDPOINT = `${API_BASE_URL}/ama`;
const CHECK_API_ENDPOINT = `${API_BASE_URL}/check`;
const REFRESHER_API_ENDPOINT = `${API_BASE_URL}/refresher`;
const FEEDBACK_API_ENDPOINT = `${API_BASE_URL}/submit-feedback`;

// --- DOM Elements (most from original index.html) ---
const mathProblemText = document.getElementById('mathProblemText');
const mathProblemFile = document.getElementById('mathProblemFile');
const solutionOutput = document.getElementById('solutionOutput'); // Inside solution-display-card
const alertBox = document.getElementById('alertBox');
const copySolutionButton = document.getElementById('copySolutionButton');
const triggerFileInputButton = document.getElementById('triggerFileInputButton');
const solveUnifiedButton = document.getElementById('solveUnifiedButton');
const selectedFileInfo = document.getElementById('selectedFileInfo');

// Modal elements
const clarifyStepModalElement = document.getElementById('clarifyStepModal');
const clarifyStepModal = new bootstrap.Modal(clarifyStepModalElement);
const modalStepContent = document.getElementById('modalStepContent');
const modalStepNumberInput = document.getElementById('modalStepNumber');
const clarificationQuestion = document.getElementById('clarificationQuestion');
const clarificationForm = document.getElementById('clarificationForm');
const clarificationResult = document.getElementById('clarificationResult');
const clarificationOutput = document.getElementById('clarificationOutput');
const modalAlertBox = document.getElementById('modalAlertBox');
const submitClarificationButton = document.getElementById('submitClarificationButton');

// Practice Problem Elements (using new card ID for section)
const practiceProblemsSectionCard = document.getElementById('practice-problems-card'); // Updated ID
const practiceSlider = document.getElementById('practiceProblemSlider');
const practiceCount = document.getElementById('practiceProblemCount');
const generatePracticeButton = document.getElementById('generatePracticeButton');
const practiceOutput = document.getElementById('practice-problems-output'); // Inner div
const practiceLoading = document.getElementById('practice-loading');

// AMA Chatbot Elements
const amaInput = document.getElementById('ama-input');
const sendButton = document.getElementById('send-button'); // Kept original ID for JS
const chatWindow = document.getElementById('chat-window');

// Feedback DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const feedbackEmail = document.getElementById('feedbackEmail');
const feedbackText = document.getElementById('feedbackText');
const submitFeedbackButton = document.getElementById('submitFeedbackButton');
const feedbackAlertBox = document.getElementById('feedbackAlertBox');
const ratingError = document.getElementById('ratingError');

// DOM Elements for Step-by-Step Display & Image Preview (from original index.html)
const displayAllStepsRadio = document.getElementById('displayAllSteps');
const displayOneByOneRadio = document.getElementById('displayOneByOne');
const nextStepButton = document.getElementById('nextStepButton'); // This ID is crucial
const uploadedQuestionImagePreviewArea = document.getElementById('uploadedQuestionImagePreviewArea');
const questionImageElement = document.getElementById('questionImageElement');
const preemptiveScaffoldingDiv = document.getElementById('preemptiveScaffolding');
const scaffoldingList = document.getElementById('scaffoldingList');


// --- Global Variables (from original index.html) ---
let currentProblemText = '';
let currentProblemFileURI = null;
let currentSolutionText = '';
let conversationHistory = [];
let lastIdentifiedConceptsString = '';
let currentSolutionStepsArray = []; // For index.html's step logic
let currentStepIndex = 0; // For index.html's step logic
let lastUploadedFileWasImage = false;
let lastUploadedImageSrc = '';

// NEW Global Variables for Hints
let receivedHints = [];
let currentHintIndex = 0;

// --- Helper Functions (from original index.html) ---
const startSpeechButton = document.getElementById('startSpeechButton');
let isRecording = false;
let recognition = null;

// Function to display a specific hint (NEW)
function displayHint(index) {
    if (!hintsSection || !currentHintOutput || !hintMessage || !receivedHints || receivedHints.length === 0 || index < 0 || index >= receivedHints.length) {
        console.warn("Cannot display hint:", index, receivedHints);
        revealSolution(); // Fallback to solution if hints state is invalid
        return;
    }

    currentHintIndex = index;
    const hintText = receivedHints[currentHintIndex];

    currentHintOutput.innerHTML = simpleMarkdownToHtml(hintText);
    hintMessage.textContent = `Hint ${currentHintIndex + 1} of ${receivedHints.length}`;

    // Based on the screenshot and your intended flow, the dropdown handles progression.
    // So, hide the separate 'Next Hint' button when hints are active.
    if (nextHintButton) {
         nextHintButton.style.display = 'none';
    }

     // Ensure I Solved It button is visible
     if (iSolvedItButton) iSolvedItButton.style.display = 'inline-block'; // Or 'block' depending on layout needs

     // Ensure dropdown is visible (Assuming the dropdown is the intended way to progress)
     // The parentElement is needed because the dropdown structure usually has the button inside a container div.
     const dropdownContainer = hintConfirmationDropdownElement ? hintConfirmationDropdownElement.parentElement : null;
     if (dropdownContainer) {
         dropdownContainer.style.display = 'inline-flex'; // Use inline-flex or block depending on desired layout
     }


    renderMathJax(currentHintOutput);
    hintsSection.style.display = 'block'; // Ensure hint section is visible
}


function simpleMarkdownToHtml(markdownText) {
    if (!markdownText) return '';

    let html = markdownText;

    // --- Block level elements ---

    // Headings (must be before paragraphs/newlines)
    html = html.replace(/^#### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^## (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^# (.*$)/gim, '<h3>$1</h3>');

    // Horizontal Rules (---, ***, ___)
    html = html.replace(/^\s*([-*_]){3,}\s*$/gm, '<hr>');

    // Helper to apply inline markdown to content that is not already inside HTML tags
    const applyInlineToTextNodes = (text) => {
        let processed = text;
        // Bold (**text** or __text__)
        processed = processed.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (match, p1, p2) => `<strong>${p1 || p2}</strong>`);
        // Italic (*text* or _text_)
        processed = processed.replace(/(?<!\*)\*([^* \n][^*]*?[^* \n])\*(?!\*)|_(.+?)_/g, (match, p1, p2) => `<em>${p1 || p2 || ''}</em>`);
        // Strikethrough (~~text~~)
        processed = processed.replace(/\~\~(.*?)\~\~/g, '<del>$1</del>');
        // Inline code (`code`)
        processed = processed.replace(/\`(.*?)\`/g, '<code>$1</code>');
        return processed;
    };

    // Process lists line by line, applying inline formatting to list item content
    let listProcessedHtml = "";
    let inListType = null; // 'ul' or 'ol'
    const lines = html.split('\n'); // Split original markdown by single newlines

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let processedLineContent = ""; // Content of the line after list marker removal
        let listMatch = line.match(/^\s*([\*\-\+])\s+(.*)/) || line.match(/^\s*(\d+)\.\s+(.*)/);

        if (listMatch) {
            const listCharOrNum = listMatch[1];
            // Apply inline formatting only to the text part of the list item
            const itemText = applyInlineToTextNodes(listMatch[2]);
            const currentListType = (listCharOrNum === '*' || listCharOrNum === '-' || listCharOrNum === '+') ? 'ul' : 'ol';

            if (inListType !== currentListType) {
                if (inListType) listProcessedHtml += `</${inListType}>\n`; // Close previous list
                listProcessedHtml += `<${currentListType}>\n`; // Start new list
                inListType = currentListType;
            }
            listProcessedHtml += `<li>${itemText}</li>\n`;
        } else { // Not a list item
            if (inListType) { // If we were in a list, close it
                listProcessedHtml += `</${inListType}>\n`;
                inListType = null;
            }
            // For non-list lines, apply inline markdown if it's not a heading or hr
            if (!line.match(/^<h[1-6]>|^<hr>/)) {
                processedLineContent = applyInlineToTextNodes(line);
            } else {
                processedLineContent = line; // Already an HTML block (heading/hr)
            }
            listProcessedHtml += processedLineContent + "\n";
        }
    }
    if (inListType) { // Close any open list at the end of all lines
        listProcessedHtml += `</${inListType}>\n`;
    }
    html = listProcessedHtml.trim(); // This html now has lists, headings, hr, and inline elements processed.

    // Paragraphs: Wrap remaining text blocks (separated by double newlines) in <p> tags.
    // Single newlines within these blocks are converted to <br>.
    let finalHtmlOutput = "";
    const paragraphBlocks = html.split(/\n\s*\n+/); // Split by two or more newlines

    for (const block of paragraphBlocks) {
        const trimmedBlock = block.trim();
        if (trimmedBlock.length === 0) continue;

        // Check if the block is already a known HTML block element (list, heading, hr)
        if (trimmedBlock.match(/^<(ul|ol|h[1-6]|hr|li)/i)) {
            finalHtmlOutput += trimmedBlock + '\n';
        } else {
            // It's a paragraph of text. Wrap in <p>.
            // Convert single newlines within this paragraph block to <br>.
            finalHtmlOutput += `<p>${trimmedBlock.replace(/\n/g, '<br>')}</p>\n`; // MODIFIED: \n to <br>
        }
    }
    html = finalHtmlOutput.trim();

    // Clean up: remove empty <p> tags that might result from processing
    html = html.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');
    // Clean up <br> tags right after block openings or before block closings
    html = html.replace(/<(ul|ol|li|h[1-6]|p|hr)>\s*<br\s*\/?>/gi, '<$1>');
    html = html.replace(/<br\s*\/?>\s*<\/(ul|ol|li|h[1-6]|p|hr)>/gi, '</$1>');
    // Remove <br> at the very end of a <p> tag content if it's the last thing.
    html = html.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');


    return html;
}


function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;") // Changed to &amp; for safety, though original was &
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showButtonLoading(button, loadingText = 'Processing...') {
    if (!button) return;
    button.disabled = true;
    button.classList.add('loading'); // For CSS driven states if any
    const spinner = button.querySelector('.loading-spinner');
    const textContent = button.querySelector('.button-text-content');

    if (spinner) spinner.style.display = 'inline-block'; // Original JS way
    if (textContent) {
        if (!button.originalContentHTML) button.originalContentHTML = textContent.innerHTML;
        textContent.innerHTML = loadingText;
    } else { // Fallback for buttons without dedicated text span
        if (!button.originalText) button.originalText = button.textContent.trim();
        button.textContent = loadingText;
    }
}
function hideButtonLoading(button) {
    if (!button) return;
    button.disabled = false;
    button.classList.remove('loading');
    const spinner = button.querySelector('.loading-spinner');
    const textContent = button.querySelector('.button-text-content');

    if (spinner) spinner.style.display = 'none';
    if (textContent && button.originalContentHTML) {
        textContent.innerHTML = button.originalContentHTML;
    } else if (button.originalText) {
        button.textContent = button.originalText;
    }
}

function showFeedbackAlert(message, type = 'danger') {
    if (!feedbackAlertBox) return;
    feedbackAlertBox.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
}
function clearFeedbackAlert() { if (feedbackAlertBox) feedbackAlertBox.innerHTML = ''; }
function showFeedbackButtonLoading(loadingText = 'Submitting...') { if (submitFeedbackButton) showButtonLoading(submitFeedbackButton, loadingText); }
function hideFeedbackButtonLoading() { if (submitFeedbackButton) hideButtonLoading(submitFeedbackButton); }

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearFeedbackAlert();
        feedbackForm.classList.add('was-validated');

        if (!feedbackForm.checkValidity()) {
            event.stopPropagation();
            if (ratingError) ratingError.style.display = 'block';
            return;
        }
        if (ratingError) ratingError.style.display = 'none';

        const selectedRatingInput = feedbackForm.querySelector('input[name="rating"]:checked');
        const rating = selectedRatingInput ? parseInt(selectedRatingInput.value, 10) : null;
        const email = feedbackEmail ? feedbackEmail.value.trim() : '';
        const feedback = feedbackText ? feedbackText.value.trim() : '';

        if (rating === null) { // Should be caught by checkValidity, but double check
            if (ratingError) ratingError.style.display = 'block';
            return;
        }

        const payload = { rating, email, feedback };
        showFeedbackButtonLoading();
        try {
            const response = await fetch(FEEDBACK_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const responseText = await response.text();
            let responseData = null;
            if (responseText) try { responseData = JSON.parse(responseText); } catch (e) { console.warn("Feedback JSON parse error", e); }

            if (!response.ok) {
                const errorDetail = responseData?.error || responseData?.message || responseText.substring(0, 200) || `HTTP Status: ${response.status}`;
                throw new Error(`Server error: ${errorDetail}`);
            }
            showFeedbackAlert(responseData?.message || 'Thank you for your feedback!', 'success');
            feedbackForm.reset();
            feedbackForm.classList.remove('was-validated');
            if (ratingError) ratingError.style.display = 'none';
        } catch (error) {
            showFeedbackAlert(`Failed to submit feedback: ${error.message.includes('Failed to fetch') ? 'Network error or backend unavailable.' : escapeHtml(error.message)}`, 'danger');
        } finally {
            hideFeedbackButtonLoading();
        }
    });
}

function showAlert(message, type = 'danger', container = alertBox) {
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
}
function clearAlert(container = alertBox) { if (container) container.innerHTML = ''; }

function showModalLoading() { // For clarification modal
    if (!submitClarificationButton) return;
    submitClarificationButton.disabled = true;
    const spinner = submitClarificationButton.querySelector('.loading-spinner');
    const icon = submitClarificationButton.querySelector('.button-icon');
    const textNode = Array.from(submitClarificationButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

    if (spinner) spinner.style.display = 'inline-block';
    if (icon) icon.style.display = 'none'; // Hide icon
    if (textNode) {
        if (!submitClarificationButton.originalButtonText) submitClarificationButton.originalButtonText = textNode.textContent;
        textNode.textContent = ' Getting Clarification...';
    }
}
function hideModalLoading() { // For clarification modal
    if (!submitClarificationButton) return;
    submitClarificationButton.disabled = false;
    const spinner = submitClarificationButton.querySelector('.loading-spinner');
    const icon = submitClarificationButton.querySelector('.button-icon');
    const textNode = Array.from(submitClarificationButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

    if (spinner) spinner.style.display = 'none';
    if (icon) icon.style.display = 'inline-block'; // Show icon
    if (textNode && submitClarificationButton.originalButtonText) {
        textNode.textContent = submitClarificationButton.originalButtonText;
    } else if (textNode) {
        textNode.textContent = ' Get Clarification'; // Fallback
    }
}

function renderMathJax(container) {
    if (!container || !window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
    setTimeout(() => { // Slight delay from original
        window.MathJax.typesetPromise([container]).catch(err => console.error('MathJax typesetting error:', err));
    }, 50);
}
function clearSelectedFile() {
    if (mathProblemText) mathProblemText.value = '';
    if (mathProblemFile) mathProblemFile.value = '';
    if (selectedFileInfo) selectedFileInfo.innerHTML = '';
    lastUploadedFileWasImage = false;
    lastUploadedImageSrc = '';
    if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'none';
    if (questionImageElement) questionImageElement.src = '#';
}

function showRefresherLoading() {
    if (refresherLoadingSpinner) refresherLoadingSpinner.style.display = 'flex';
    if (refresherContent) refresherContent.style.display = 'none';
    if (refresherError) refresherError.style.display = 'none';
    if (refresherExample) refresherExample.innerHTML = '';
    if (refresherSolvedQuestions) refresherSolvedQuestions.innerHTML = '';
    if (refresherModalLabel) refresherModalLabel.innerHTML = `<i class="bi bi-book-fill me-2"></i>Quick Refresher: Loading...`;
    clearAlert(refresherError);
}
function hideRefresherLoading() { if (refresherLoadingSpinner) refresherLoadingSpinner.style.display = 'none'; }

if (mathProblemText) {
    mathProblemText.addEventListener('input', function () {
        this.style.height = 'auto';
        const scrollHeight = this.scrollHeight;
        const maxHeight = 150;
        this.style.height = (scrollHeight > maxHeight ? maxHeight : scrollHeight) + 'px';
        this.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        updateSolveButtonState();
    });
    mathProblemText.addEventListener('change', updateSolveButtonState);
}

if (triggerFileInputButton) triggerFileInputButton.addEventListener('click', () => mathProblemFile?.click());

if (mathProblemFile) {
    mathProblemFile.addEventListener('change', () => {
        if (mathProblemFile.files.length > 0) {
            const file = mathProblemFile.files[0];
            const maxSizeMB = 5;
            if (file.size > maxSizeMB * 1024 * 1024) {
                showAlert(`File size exceeds ${maxSizeMB}MB.`, 'warning');
                clearSelectedFile(); updateSolveButtonState(); return;
            }
            if (selectedFileInfo) {
                selectedFileInfo.innerHTML = `Selected: <strong>${escapeHtml(file.name)}</strong> <a href="#" class="clear-file text-danger ms-2" title="Remove file" onclick="event.preventDefault(); clearSelectedFile(); updateSolveButtonState();">Remove</a>`;
                selectedFileInfo.style.display = 'block';
            }
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) { lastUploadedImageSrc = e.target.result; lastUploadedFileWasImage = true; }
                reader.readAsDataURL(file);
            } else { lastUploadedFileWasImage = false; lastUploadedImageSrc = ''; }
        } else {
            if (selectedFileInfo) selectedFileInfo.style.display = 'none';
            lastUploadedFileWasImage = false;
            lastUploadedImageSrc = '';
        }
        updateSolveButtonState();
    });
}

function revealSolution() {
    if (hintsSection) hintsSection.style.display = 'none'; // Hide hints section

    // Hide hint controls (buttons/dropdown)
    if (iSolvedItButton) iSolvedItButton.style.display = 'none';
    const dropdownContainer = hintConfirmationDropdownElement ? hintConfirmationDropdownElement.parentElement : null;
    if (dropdownContainer) {
        dropdownContainer.style.display = 'none';
    }
    if (nextHintButton) nextHintButton.style.display = 'none'; // Ensure the separate button is hidden too
    if (hintMessage) hintMessage.textContent = ''; // Clear hint message
    if (currentHintOutput) currentHintOutput.innerHTML = ''; // Clear hint content


    // Display the solution, concepts, and practice sections
    const solutionCard = document.getElementById('solution-display-card');
    if (solutionCard) solutionCard.style.display = 'block';
    if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'block';
    if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'block';


    // Now, render the full solution using the stored data
    displaySolution(currentSolutionText, currentProblemText, lastIdentifiedConceptsString, currentProblemFileURI);

    // renderSolutionSteps (called by displaySolution) will handle showing the `nextStepButton` if in 'one-by-one' mode.

    // Scroll to the solution section
    const solutionAnchor = document.getElementById('solution-related-content');
    if (solutionAnchor) {
        solutionAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


function handleSolvedIt() {
    if (hintsSection) hintsSection.style.display = 'none'; // Hide hints section

    // Hide hint controls (buttons/dropdown)
    if (iSolvedItButton) iSolvedItButton.style.display = 'none';
    const dropdownContainer = hintConfirmationDropdownElement ? hintConfirmationDropdownElement.parentElement : null;
    if (dropdownContainer) {
        dropdownContainer.style.display = 'none';
    }
    if (nextHintButton) nextHintButton.style.display = 'none'; // Ensure separate button is hidden
    if (hintMessage) hintMessage.textContent = ''; // Clear hint message
    if (currentHintOutput) currentHintOutput.innerHTML = ''; // Clear hint content


    // Display a success message in the alert box
    showAlert("Great job! You solved the problem!", "success");

    // Reset hint state
    currentHintIndex = 0;
    receivedHints = []; // Clear hints data

    // Clear the main problem input area for a new problem
    clearSelectedFile();
    if (mathProblemText) mathProblemText.value = '';

    // Hide all result sections, including solution/concepts/practice
    if (solutionOutput) solutionOutput.innerHTML = '<p class="text-muted">Your step-by-step solution will appear here...</p>';
    if (copySolutionButton) copySolutionButton.style.display = 'none';
    if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';
    if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
    const solutionCard = document.getElementById('solution-display-card');
    if (solutionCard) solutionCard.style.display = 'none';
    if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'none';
    if (preemptiveScaffoldingDiv) preemptiveScaffoldingDiv.style.display = 'none';


    // Scroll back to the solver input section
    const solverAnchor = document.getElementById('solver-section-anchor');
    if (solverAnchor) {
        solverAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}




// Modify the solveUnifiedButton event listener
if (solveUnifiedButton) {
    solveUnifiedButton.addEventListener('click', async () => {
        // Store the current radio selection - this is for the *solution* display mode
        let selectedSolutionDisplayMode = 'all';
        if (displayOneByOneRadio && displayOneByOneRadio.checked) selectedSolutionDisplayMode = 'one-by-one';
        else if (displayAllStepsRadio && displayAllStepsRadio.checked) selectedSolutionDisplayMode = 'all';


        clearAlert();

        // --- Hide previous results ---
        if (hintsSection) hintsSection.style.display = 'none'; // Hide hints
        if (iSolvedItButton) iSolvedItButton.style.display = 'none';
        if (nextHintButton) nextHintButton.style.display = 'none';
        if (hintMessage) hintMessage.textContent = '';
        if (currentHintOutput) currentHintOutput.innerHTML = '<p class="text-muted text-center">Your hint will appear here...</p>'; // Reset hint area

        const solutionCard = document.getElementById('solution-display-card');
        if (solutionCard) solutionCard.style.display = 'none'; // Hide solution
        if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none'; // Hide concepts
        if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none'; // Hide practice

        if (practiceOutput) practiceOutput.innerHTML = '<p class="text-muted">Click \'Generate\' after getting a solution.</p>';
        if (identifiedConceptsList) identifiedConceptsList.innerHTML = '';
        clearAlert(conceptsRefresherAlert);
        if (preemptiveScaffoldingDiv) preemptiveScaffoldingDiv.style.display = 'none';
        if (scaffoldingList) scaffoldingList.innerHTML = '';

        if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'none';
        if (questionImageElement) questionImageElement.src = '#';

        const problemTextValue = mathProblemText ? mathProblemText.value.trim() : '';
        const file = mathProblemFile ? mathProblemFile.files[0] : null;
        if (!file) { lastUploadedFileWasImage = false; lastUploadedImageSrc = ''; }
        else { // If file exists, prepare the preview data regardless of API success
             if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) { lastUploadedImageSrc = e.target.result; lastUploadedFileWasImage = true; }
                reader.readAsDataURL(file);
             } else { lastUploadedFileWasImage = false; lastUploadedImageSrc = ''; }
        }


        if (!problemTextValue && !file) { showAlert('Please type a problem or upload a file.'); return; }
        if (isRecording && recognition) recognition.stop();

        showButtonLoading(solveUnifiedButton, 'Solving...');
        if (solutionOutput) solutionOutput.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="min-height: 150px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><span class="ms-2 text-muted">Processing...</span></div>`;
        if (copySolutionButton) copySolutionButton.style.display = 'none';

        // Reset global state variables related to the previous problem/solution/hints
        currentProblemText = ''; currentProblemFileURI = null; currentSolutionText = '';
        currentSolutionStepsArray = []; currentStepIndex = 0;
        receivedHints = []; currentHintIndex = 0;
        lastIdentifiedConceptsString = '';

        if (nextStepButton) nextStepButton.style.display = 'none';


        const formData = new FormData();
        if (problemTextValue) formData.append('problemText', problemTextValue);
        if (file) formData.append('problemFile', file);

        try {
            const response = await fetch(SOLVE_API_ENDPOINT, { method: 'POST', body: formData });
            let responseData;
            try { responseData = await response.json(); } catch (e) {
                if (!response.ok) { const txt = await response.text(); throw new Error(`Server error (${response.status}): ${txt.substring(0, 200)}`); }
                throw new Error("Unexpected non-JSON response.");
            }

            if (!response.ok) {
                // Show error in the main alert box
                showAlert(`Failed to get solution: ${responseData?.error || responseData?.message || `HTTP error! Status: ${response.status}`}`, 'danger');
                 // Show error in the main solution output area as a fallback
                 if (solutionOutput) solutionOutput.innerHTML = `<p class="text-danger">${escapeHtml(responseData?.error || responseData?.message || `Error processing request. Status: ${response.status}`)}</p>`;
                 // Ensure cards remain hidden or show empty
                 if (solutionCard) solutionCard.style.display = 'block'; // Show the card to display the error message
                 if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
                 if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';

                return; // Stop further processing on error
            }

            // Handle preemptive scaffolding even on success, if provided
            if (responseData.preemptiveScaffolding?.length > 0) {
                if (scaffoldingList) scaffoldingList.innerHTML = responseData.preemptiveScaffolding.map(tip => `<li>${escapeHtml(tip)}</li>`).join('');
                if (preemptiveScaffoldingDiv) preemptiveScaffoldingDiv.style.display = 'block';
                renderMathJax(preemptiveScaffoldingDiv);
            } else {
                if (preemptiveScaffoldingDiv) preemptiveScaffoldingDiv.style.display = 'none';
            }

            // Store ALL received data
            currentProblemText = problemTextValue; // Keep original text
            currentProblemFileURI = responseData.file_uri || null; // Store file URI if returned
            currentSolutionText = responseData.solution || '';
            lastIdentifiedConceptsString = responseData.identifiedConcepts || 'Not identified.';
            receivedHints = Array.isArray(responseData.hints) ? responseData.hints : []; // Store hints, ensure it's an array

            // Display uploaded image preview if available
             if (lastUploadedFileWasImage && lastUploadedImageSrc) {
                 if (questionImageElement) questionImageElement.src = lastUploadedImageSrc;
                 if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'block';
             } else {
                 if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'none';
                 if (questionImageElement) questionImageElement.src = '#';
             }


            // Decide whether to show hints or go straight to solution
            if (receivedHints.length > 0 && currentSolutionText) {
                // Hints available - start the hint flow
                currentHintIndex = 0;
                displayHint(currentHintIndex); // Display the first hint

                // Clear solution output area temporarily
                if (solutionOutput) solutionOutput.innerHTML = '';
                 // Ensure solution card and others are hidden
                 if (solutionCard) solutionCard.style.display = 'none';
                 if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
                 if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';

            } else if (currentSolutionText) {
                // No hints available or generated, but got a solution - show solution directly
                showAlert("Hints could not be generated for this problem. Displaying the solution.", "info");
                 // Call revealSolution which will display everything
                revealSolution();

            } else {
                // Neither hints nor solution were generated
                showAlert("Could not generate hints or a solution for this problem. Please try rephrasing or a different problem.", "warning");
                if (solutionOutput) solutionOutput.innerHTML = '<p class="text-warning">No solution generated.</p>';
                // Show the solution card to show the warning, but hide concepts/practice
                 if (solutionCard) solutionCard.style.display = 'block';
                 if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
                 if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';

            }

             // Restore the previously selected radio button state *after* solution is displayed
             // This logic might need adjustment depending on *when* you want the user to select the mode.
             // If mode selection should only affect the *final* solution display, keep it here.
             // If you wanted hints to also be step-by-step, the logic would be different.
             // Assuming mode affects final solution display:
             if (selectedSolutionDisplayMode === 'one-by-one' && displayOneByOneRadio) {
                 // Do nothing, displaySolution will handle rendering 'all' first,
                 // then the user needs to click the radio to switch to 'one-by-one'.
                 // Or we could force the initial render mode here IF solution was revealed directly.
                 // Let's handle the switch later in revealSolution if needed, or rely on user clicking radio.
             } else if (displayAllStepsRadio) {
                 // Ensure the 'all' radio is checked by default if no preference was stored.
                 displayAllStepsRadio.checked = true;
             }


        } catch (error) {
            console.error('Error solving problem:', error);
            showAlert(`Failed to get solution: ${error.message.includes('Failed to fetch') ? 'Network error or backend unavailable.' : escapeHtml(error.message)}`);
            if (solutionOutput) solutionOutput.innerHTML = '<p class="text-danger">Error processing request. Please try again.</p>';
             // Ensure cards remain hidden or show empty/error state
             const solutionCard = document.getElementById('solution-display-card');
             if (solutionCard) solutionCard.style.display = 'block'; // Show card with error
             if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
             if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';
             if (hintsSection) hintsSection.style.display = 'none';


        } finally {
            hideButtonLoading(solveUnifiedButton);
            updateSolveButtonState(); // Re-enable solve button
        }
    });
}



// Add event listener for I Solved It button (NEW)
if (iSolvedItButton) {
    iSolvedItButton.addEventListener('click', () => {
        handleSolvedIt();
    });
}


const dropdownContainer = hintConfirmationDropdownElement ? hintConfirmationDropdownElement.parentElement : null;

if (dropdownContainer) {
     dropdownContainer.addEventListener('click', (event) => {
         const target = event.target.closest('.dropdown-item');
         if (target) {
             const action = target.dataset.action;

             if (action === 'solved') {
                 // User clicked "Yes, thanks!"
                 handleSolvedIt();
                 // Bootstrap dropdown should close automatically on item click
             } else if (action === 'need-next') {
                 // User clicked "No, need next hint" --> IMPLEMENT THE LOGIC HERE
                 clearAlert(); // Clear any previous alerts

                 // Logic to show the next hint or the solution
                 if (currentHintIndex < receivedHints.length - 1) {
                     // There are more hints available
                     currentHintIndex++; // Move to the next hint index
                     displayHint(currentHintIndex); // Display the next hint
                 } else {
                     // This was the last hint (Hint 3 of 3), reveal the full solution
                     revealSolution(); // Call the existing function to reveal the solution
                 }
                 // Bootstrap dropdown should close automatically on item click
             }
         }
     });
} else {
    console.warn("Hint confirmation dropdown or its container not found.");
}


const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognitionAPI && startSpeechButton) {
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = false; recognition.interimResults = true; recognition.lang = 'en-US';
    let finalTranscript = ''; recognition.previousInterim = '';

    recognition.onstart = () => {
        isRecording = true; startSpeechButton.classList.add('recording'); startSpeechButton.title = 'Recording... Click to stop';
        startSpeechButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic-mute-fill" viewBox="0 0 16 16"><path d="M13 8c0 .564-.094 1.107-.266 1.613l-1.84-1.84a3 3 0 0 0 0-2.826L13 8zm-9.054.904a3 3 0 0 0 0 2.828l1.84-1.84L4.946 8.904zm4.964-4.964v5.5l2.275 2.274a3.5 3.5 0 0 1-3.694-6.95l1.419 1.42zm-1.849 1.85a3.5 3.5 0 0 0-4.63 4.465L3.5 12l.39.39 5.158-5.159L5.833 5.832zM9.344 15c-.002 0-.026 0-.042 0a1 1 0 0 0-.948.684l-.437 1.463A.5.5 0 0 1 7.9 16h-1.88c-.276 0-.526-.179-.617-.429l-.437-1.463A1 1 0 0 0 4.699 15c-.016 0-.04-.002-.042 0h-.5a.5.5 0 0 1-.5-.5c0-1.458.362-2.866 1.05-4.128L1.917 14.17C.451 12.796 0 10.68 0 8c0-1.936.338-3.796.966-5.5H4.5a.5.5 0 0 1 0 1H1.73c-.457 1.257-.731 2.668-.731 4.128C1 10.093 1.464 11.8 2.525 13.07l1.49-1.49A6.5 6.5 0 0 1 8 4.5a6.5 6.5 0 0 1 1.923 4.307l1.49 1.49A6.5 6.5 0 0 1 15 8.5v-.5a.5.5 0 0 1 1 0v.5c0 2.071-.573 3.998-1.641 5.607l-1.49-1.49A7.482 7.482 0 0 0 13 8zM8 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 8 0"/></svg>`;
        updateSolveButtonState();
    };
    recognition.onresult = (event) => {
        let interimTranscript = ''; finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            else interimTranscript += event.results[i][0].transcript;
        }
        const currentText = mathProblemText.value;
        const textWithoutPreviousInterim = currentText.endsWith(recognition.previousInterim) ? currentText.substring(0, currentText.length - recognition.previousInterim.length) : currentText;
        mathProblemText.value = textWithoutPreviousInterim + (finalTranscript || interimTranscript);
        recognition.previousInterim = interimTranscript;
        mathProblemText.dispatchEvent(new Event('input'));
    };
    recognition.onerror = (event) => {
        let msg = 'Voice input error.';
        if (event.error === 'not-allowed') msg = 'Microphone permission denied.';
        else if (event.error === 'no-speech') msg = 'No speech detected.';
        else if (event.error === 'audio-capture') msg = 'Could not capture audio. Check microphone.';
        showAlert(msg, 'warning'); isRecording = false;
        startSpeechButton.classList.remove('recording'); startSpeechButton.title = 'Speak your math problem';
        startSpeechButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16"><path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3.5 8V7a.5.5 0 0 1 .5-.5"/>`;
        recognition.previousInterim = ''; updateSolveButtonState();
    };
    recognition.onend = () => {
        isRecording = false; startSpeechButton.classList.remove('recording'); startSpeechButton.title = 'Speak your math problem';
        startSpeechButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16"><path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3.5 8V7a.5.5 0 0 1 .5-.5"/>`;
        recognition.previousInterim = ''; updateSolveButtonState();
    };
    startSpeechButton.addEventListener('click', () => {
        if (isRecording) recognition.stop();
        else { finalTranscript = ''; recognition.previousInterim = ''; recognition.start(); }
    });
} else { if (startSpeechButton) startSpeechButton.style.display = 'none'; }

function updateSolveButtonState() {
    const problemTextValue = mathProblemText ? mathProblemText.value.trim() : '';
    const fileSelected = mathProblemFile ? mathProblemFile.files.length > 0 : false;
    if (solveUnifiedButton) solveUnifiedButton.disabled = !(problemTextValue || fileSelected) || isRecording;
}

function renderDiagramFromData(diagramData) { // From original index.html (SVG rendering)
    if (!diagramData || !diagramData.viewBox || !diagramData.elements) return null;
    const svgNS = "http://www.w3.org/2000/svg";
    const svgElement = document.createElementNS(svgNS, "svg");
    svgElement.setAttribute("viewBox", diagramData.viewBox);
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    diagramData.elements.forEach(el => {
        let svgChild;
        switch (el.type) {
            case "line": svgChild = document.createElementNS(svgNS, "line"); svgChild.setAttribute("x1", el.x1); svgChild.setAttribute("y1", el.y1); svgChild.setAttribute("x2", el.x2); svgChild.setAttribute("y2", el.y2); svgChild.setAttribute("stroke", el.stroke || "black"); svgChild.setAttribute("stroke-width", el.strokeWidth || 1); if (el.strokeDasharray) svgChild.setAttribute("stroke-dasharray", el.strokeDasharray); break;
            case "circle": svgChild = document.createElementNS(svgNS, "circle"); svgChild.setAttribute("cx", el.cx); svgChild.setAttribute("cy", el.cy); svgChild.setAttribute("r", el.r); svgChild.setAttribute("stroke", el.stroke || "black"); svgChild.setAttribute("stroke-width", el.strokeWidth || 1); svgChild.setAttribute("fill", el.fill || "none"); break;
            case "rect": svgChild = document.createElementNS(svgNS, "rect"); svgChild.setAttribute("x", el.x); svgChild.setAttribute("y", el.y); svgChild.setAttribute("width", el.width); svgChild.setAttribute("height", el.height); svgChild.setAttribute("stroke", el.stroke || "black"); svgChild.setAttribute("stroke-width", el.strokeWidth || 1); svgChild.setAttribute("fill", el.fill || "none"); if (el.rx) svgChild.setAttribute("rx", el.rx); if (el.ry) svgChild.setAttribute("ry", el.ry); break;
            case "text": svgChild = document.createElementNS(svgNS, "text"); svgChild.setAttribute("x", el.x); svgChild.setAttribute("y", el.y); svgChild.setAttribute("fill", el.fill || "black"); svgChild.setAttribute("font-size", el.fontSize || "10px"); if (el.fontFamily) svgChild.setAttribute("font-family", el.fontFamily); if (el.textAnchor) svgChild.setAttribute("text-anchor", el.textAnchor); if (el.dominantBaseline) svgChild.setAttribute("dominant-baseline", el.dominantBaseline); svgChild.textContent = el.text; break;
            case "path": svgChild = document.createElementNS(svgNS, "path"); svgChild.setAttribute("d", el.d); svgChild.setAttribute("stroke", el.stroke || "black"); svgChild.setAttribute("stroke-width", el.strokeWidth || 1); svgChild.setAttribute("fill", el.fill || "none"); if (el.strokeLinecap) svgChild.setAttribute("stroke-linecap", el.strokeLinecap); if (el.strokeLinejoin) svgChild.setAttribute("stroke-linejoin", el.strokeLinejoin); break;
            default: console.warn("Unsupported SVG element type:", el.type);
        }
        if (svgChild) svgElement.appendChild(svgChild);
    });
    const containerDiv = document.createElement('div');
    containerDiv.className = 'solution-diagram-container'; // Class from index.html CSS
    containerDiv.appendChild(svgElement);
    return containerDiv;
}

function parseAndStoreSolutionSteps(solutionText) { // From original index.html
    currentSolutionStepsArray = [];
    if (!solutionText) return;
    const diagramRegex = /<DIAGRAM_SVG_DATA>([\s\S]*?)<\/DIAGRAM_SVG_DATA>/g;
    const stepSplitRegex = /(?=### (?:Step \d+|Final Answer):)/;
    let rawSteps = solutionText.trim().split(stepSplitRegex).map(part => part.trim()).filter(part => part.length > 0);

    currentSolutionStepsArray = rawSteps.map((part, index) => {
        let stepHtmlContent = ''; let stepHeader = ''; let diagramContainerHtml = '';
        if (part.startsWith('### Step ')) {
            const match = part.match(/^(### Step \d+:)([\s\S]*)/);
            if (match) { stepHeader = `<h5>${match[1].replace('### ', '')}</h5>`; stepHtmlContent = match[2].trim(); }
        } else if (part.startsWith('### Final Answer:')) {
            const match = part.match(/^(### Final Answer:)([\s\S]*)/);
            if (match) { stepHeader = `<strong>${match[1].replace('### ', '')}</strong>`; stepHtmlContent = match[2].trim(); }
        } else { stepHtmlContent = part; }

        let processedContent = stepHtmlContent.replace(diagramRegex, (match, jsonDataString) => {
            try {
                const diagramData = JSON.parse(jsonDataString.trim());
                const diagramElement = renderDiagramFromData(diagramData); // SVG rendering
                if (diagramElement) { diagramContainerHtml += diagramElement.outerHTML; return ''; }
            } catch (e) { console.error("Error parsing/rendering SVG diagram:", e); return `<p class="text-danger">Error displaying diagram.</p>`; }
            return '';
        });
        processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');

        // MODIFIED: Use new class names for dashboard styling
        let finalStepHtml = '';
        if (part.startsWith('### Step ')) {
            finalStepHtml = `<div class="step interactive-step fade-in" data-step-number="${part.match(/Step (\d+)/)[1]}" title="Click to clarify this step">
                                         ${stepHeader}
                                         <div class="step-content">${processedContent}${diagramContainerHtml}</div>
                                     </div>`;
        } else if (part.startsWith('### Final Answer:')) {
            finalStepHtml = `<div class="final-answer fade-in">
                                         ${stepHeader}
                                         <div class="final-answer-content">${processedContent}${diagramContainerHtml}</div>
                                     </div>`;
        } else { finalStepHtml = `<p>${processedContent}${diagramContainerHtml}</p>`; }
        return finalStepHtml;
    });
}

function renderSolutionSteps(mode) { // From original index.html
    if (!solutionOutput || currentSolutionStepsArray.length === 0) {
        if (nextStepButton) nextStepButton.style.display = 'none';
        if (solutionOutput) solutionOutput.innerHTML = '<p class="text-muted">Solution steps will appear here...</p>';
        const solutionCard = document.getElementById('solution-display-card');
        if (solutionCard) solutionCard.style.display = 'block'; // Make card visible even if empty
        return;
    }
    const solutionCard = document.getElementById('solution-display-card');
    if (solutionCard) solutionCard.style.display = 'block'; // Make card visible

    if (mode === 'all' || (displayAllStepsRadio && displayAllStepsRadio.checked)) {
        solutionOutput.innerHTML = currentSolutionStepsArray.join('');
        if (nextStepButton) nextStepButton.style.display = 'none';
        const endMsg = document.getElementById('endOfSolutionMessage');
        if (endMsg) endMsg.style.display = 'none'; // Hide end message for 'all' mode
    } else if (mode === 'one-by-one' || (displayOneByOneRadio && displayOneByOne.checked)) {
        solutionOutput.innerHTML = currentSolutionStepsArray.slice(0, currentStepIndex + 1).join('');
        const stepControlsDiv = document.getElementById('stepByStepControls');
        const endMsg = document.getElementById('endOfSolutionMessage');

        if (stepControlsDiv) stepControlsDiv.style.display = 'block'; // Show controls container

        if (currentStepIndex < currentSolutionStepsArray.length - 1) {
            if (nextStepButton) nextStepButton.style.display = 'inline-block'; // Show next button
            if (endMsg) endMsg.style.display = 'none'; // Hide end message
        } else {
            if (nextStepButton) nextStepButton.style.display = 'none'; // Hide next button
            if (endMsg) endMsg.style.display = 'block'; // Show end message
        }
    }
    renderMathJax(solutionOutput);
}

function displaySolution(solutionText, problemTextUsed, identifiedConceptsString, fileURIUsed = null) { // From original index.html
    currentProblemText = problemTextUsed;
    currentProblemFileURI = fileURIUsed;
    currentSolutionText = solutionText;
    lastIdentifiedConceptsString = identifiedConceptsString || 'Not identified.'; // Ensure default

    const solutionCard = document.getElementById('solution-display-card');
    if (solutionCard) solutionCard.style.display = 'block'; // Make card visible


    if (lastUploadedFileWasImage && lastUploadedImageSrc) {
        if (questionImageElement) questionImageElement.src = lastUploadedImageSrc;
        if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'block';
    } else {
        if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'none';
        if (questionImageElement) questionImageElement.src = '#';
    }

    parseAndStoreSolutionSteps(solutionText);
    currentStepIndex = 0;

    renderSolutionSteps(displayAllStepsRadio.checked ? 'all' : 'one-by-one');

    if (copySolutionButton) copySolutionButton.style.display = 'block';

    if (solutionText) {
        if (practiceProblemsSectionCard) { practiceProblemsSectionCard.style.display = 'block'; practiceProblemsSectionCard.classList.add('fade-in'); }
        if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'block';
        if (practiceOutput) practiceOutput.innerHTML = '<p class="text-muted">Click \'Generate\' for practice problems.</p>';
        if (identifiedConceptsList) identifiedConceptsList.innerHTML = `<strong>Concepts:</strong> ${escapeHtml(lastIdentifiedConceptsString)}`;
        renderMathJax(practiceOutput); // Render if any default text has math
        if (practiceLoading) practiceLoading.style.display = 'none';
    } else {
        if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';
        if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
        if (solutionOutput) solutionOutput.innerHTML = '<p class="text-danger">No solution steps found.</p>';
    }
}


if (quickRefresherButton) {
    quickRefresherButton.addEventListener('click', async () => {
        clearAlert(conceptsRefresherAlert);
        if (!lastIdentifiedConceptsString || lastIdentifiedConceptsString.trim() === '' || lastIdentifiedConceptsString.includes('Not identified.')) {
            showAlert("No specific concepts identified for this problem.", "info", conceptsRefresherAlert); return;
        }
        if (refresherModalLabel) refresherModalLabel.innerHTML = `<i class="bi bi-book-fill me-2"></i>Quick Refresher for Key Concepts`;
        showRefresherLoading(); refresherModal.show();

        const payload = { concepts: lastIdentifiedConceptsString };
        try {
            const response = await fetch(REFRESHER_API_ENDPOINT, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            let responseData;
            try { responseData = await response.json(); } catch (e) {
                const txt = await response.text();
                if (!response.ok) throw new Error(`Server error (${response.status}): ${txt.substring(0, 200)}`);
                throw new Error("Received an unexpected non-JSON response from check server.");
            }
            if (!response.ok) throw new Error(responseData?.error || responseData?.message || `HTTP error! Status: ${response.status}`);

            if (responseData.concept_name || responseData.concept_description || responseData.example || responseData.solved_questions?.length > 0) {
                if (refresherModalLabel && responseData.concept_name) refresherModalLabel.innerHTML = `<i class="bi bi-book-fill me-2"></i>Quick Refresher: ${escapeHtml(responseData.concept_name)}`;
                if (refresherConceptDescription) refresherConceptDescription.innerHTML = responseData.concept_description ? escapeHtml(responseData.concept_description) : '<p class="text-muted">Description not available.</p>';
                if (refresherExample) refresherExample.innerHTML = responseData.example ? escapeHtml(responseData.example) : '<p class="text-muted">Example not available.</p>';
                if (responseData.solved_questions?.length > 0) {
                    if (refresherSolvedQuestions) refresherSolvedQuestions.innerHTML = responseData.solved_questions.map((q_obj, index) =>
                        q_obj?.question && q_obj?.solution ? `<p><strong>Problem ${index + 1}:</strong> ${escapeHtml(q_obj.question)}</p><p><strong>Solution:</strong> ${escapeHtml(q_obj.solution)}</p>${index < responseData.solved_questions.length - 1 ? '<hr style="margin: 15px 0;">' : ''}` : ''
                    ).join('');
                } else { if (refresherSolvedQuestions) refresherSolvedQuestions.innerHTML = '<p class="text-muted">Solved questions not available.</p>'; }
                renderMathJax(refresherConceptDescription); renderMathJax(refresherExample); renderMathJax(refresherSolvedQuestions);
                if (refresherContent) refresherContent.style.display = 'block'; if (refresherError) refresherError.style.display = 'none';
            } else {
                if (refresherContent) refresherContent.style.display = 'none'; if (refresherError) refresherError.style.display = 'block';
                if (refresherError) { refresherError.classList.remove('alert-danger'); refresherError.classList.add('alert-info'); refresherError.innerHTML = 'No specific refresher content found for these concepts.'; }
            }
        } catch (error) {
            console.error('Error fetching refresher content:', error);
            if (refresherContent) refresherContent.style.display = 'none'; if (refresherError) refresherError.style.display = 'block';
            if (refresherError) { refresherError.classList.remove('alert-info'); refresherError.classList.add('alert-danger'); refresherError.innerHTML = `Failed to load refresher content: ${error.message.includes('Failed to fetch') ? 'Network error or backend unavailable.' : escapeHtml(error.message)}`; }
        } finally {
            hideRefresherLoading();
        }
    });
}

if (practiceSlider && practiceCount) practiceSlider.addEventListener('input', () => { practiceCount.textContent = practiceSlider.value; });

if (generatePracticeButton) {
    generatePracticeButton.addEventListener('click', async () => {
        clearAlert();
        if (!currentSolutionText) { showAlert("Cannot generate practice: No problem context available.", "warning"); return; }
        const numberOfProblems = parseInt(practiceSlider.value, 10);
        if (practiceOutput) practiceOutput.innerHTML = ''; if (practiceLoading) practiceLoading.style.display = 'block';
        showButtonLoading(generatePracticeButton, 'Generating...');

        const payload = { contextText: currentSolutionText, numberOfProblems };
        try {
            const response = await fetch(PRACTICE_API_ENDPOINT, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData?.error || responseData?.message || `HTTP error! Status: ${response.status}`);

            if (responseData.practice_text) {
                const problemRegex = /(\d+\.\s*?)([\s\S]*?)(?=\n\d+\.\s*|\n*$)/g; let match, problemsFound = false;
                const tempDiv = document.createElement('div'); // To batch DOM appends
                while ((match = problemRegex.exec(responseData.practice_text)) !== null) {
                    problemsFound = true;
                    const problemDiv = document.createElement('div');
                    // MODIFIED: Use new class name for dashboard styling
                    problemDiv.classList.add('practice-problem', 'interactive-practice', 'fade-in');
                    problemDiv.dataset.problemText = `${match[1].trim()} ${match[2].trim()}`;
                    problemDiv.innerHTML = `<span class="problem-number">${escapeHtml(match[1].trim())}</span> <span>${escapeHtml(match[2].trim())}</span>`;
                    tempDiv.appendChild(problemDiv);
                }
                if (practiceOutput) while (tempDiv.firstChild) practiceOutput.appendChild(tempDiv.firstChild); // Append all at once

                if (!problemsFound && practiceOutput) {
                    const rawDiv = document.createElement('div'); rawDiv.classList.add('practice-problem'); rawDiv.textContent = responseData.practice_text;
                    practiceOutput.appendChild(rawDiv);
                }
                renderMathJax(practiceOutput);
            } else { if (practiceOutput) practiceOutput.innerHTML = '<p class="text-muted">No practice problems were generated.</p>'; }
        } catch (error) {
            console.error('Error generating practice problems:', error);
            showAlert(`Failed to generate practice problems: ${error.message}`, 'danger');
            if (practiceOutput) practiceOutput.innerHTML = '<p class="text-danger">Could not load practice problems.</p>';
        } finally {
            if (practiceLoading) practiceLoading.style.display = 'none';
            hideButtonLoading(generatePracticeButton);
        }
    });
}

if (practiceOutput) {
    practiceOutput.addEventListener('click', (event) => {
        const practiceProblemDiv = event.target.closest('.interactive-practice');
        if (practiceProblemDiv) {
            const problemText = practiceProblemDiv.dataset.problemText;
            if (!problemText) { showAlert("Could not load problem text.", "warning", practiceModalAlertBox); return; }
            if (modalPracticeProblemContent) modalPracticeProblemContent.textContent = problemText;
            if (modalPracticeProblemTextHidden) modalPracticeProblemTextHidden.value = problemText;
            renderMathJax(modalPracticeProblemContent);
            if (practiceSolutionFile) practiceSolutionFile.value = '';
            if (practiceSelectedFileInfo) practiceSelectedFileInfo.textContent = '';
            if (practiceCheckResult) practiceCheckResult.style.display = 'none';
            if (practiceCheckOutput) practiceCheckOutput.innerHTML = '';
            clearAlert(practiceModalAlertBox);
            practiceCheckModal.show();
        }
    });
}

if (practiceCheckForm) {
    practiceCheckForm.addEventListener('submit', async (event) => {
        event.preventDefault(); clearAlert(practiceModalAlertBox);
        const practiceProblemText = modalPracticeProblemTextHidden.value;
        const solutionFile = practiceSolutionFile.files[0];
        if (!solutionFile) { showAlert('Please upload your solution file.', 'warning', practiceModalAlertBox); return; }
        if (!practiceProblemText) { showAlert('Error: Could not identify problem text.', 'danger', practiceModalAlertBox); return; }
        const maxSizeMB = 10;
        if (solutionFile.size > maxSizeMB * 1024 * 1024) { showAlert(`File size exceeds ${maxSizeMB}MB.`, 'warning', practiceModalAlertBox); practiceSolutionFile.value = ''; practiceSelectedFileInfo.textContent = ''; return; }

        showButtonLoading(submitPracticeCheckButton, 'Checking...'); // JS for this button needs to be adapted if it's not generic
        if (practiceCheckResult) practiceCheckResult.style.display = 'none'; if (practiceCheckOutput) practiceCheckOutput.innerHTML = '';
        const formData = new FormData();
        formData.append('practiceProblem', practiceProblemText); formData.append('solutionFile', solutionFile);

        try {
            const response = await fetch(CHECK_API_ENDPOINT, { method: 'POST', body: formData });
            let responseData;
            try { responseData = await response.json(); } catch (e) {
                if (!response.ok) { const txt = await response.text(); throw new Error(`Server error (${response.status}): ${txt.substring(0, 200)}`); }
                throw new Error("Received an unexpected non-JSON response from check server.");
            }
            if (!response.ok) throw new Error(responseData?.error || responseData?.message || `HTTP error! Status: ${response.status}`);
            if (responseData.check_result) {
                const htmlFeedback = simpleMarkdownToHtml(responseData.check_result);
                if (practiceCheckOutput) practiceCheckOutput.innerHTML = htmlFeedback;

                renderMathJax(practiceCheckOutput); // Ensure MathJax processes the new content
                if (practiceCheckResult) practiceCheckResult.style.display = 'block';
            } else { throw new Error("Feedback missing in server response."); }
        } catch (error) {
            console.error('Error checking practice solution:', error);
            showAlert(`Failed to check solution: ${error.message.includes('Failed to fetch') ? 'Network error.' : escapeHtml(error.message)}`, 'danger', practiceModalAlertBox);
            if (practiceCheckResult) practiceCheckResult.style.display = 'none';
        } finally {
            hideButtonLoading(submitPracticeCheckButton); // JS for this button needs to be adapted
        }
    });
}

if (practiceSolutionFile && practiceSelectedFileInfo) {
    practiceSolutionFile.addEventListener('change', () => {
        if (practiceSolutionFile.files.length > 0) {
            practiceSelectedFileInfo.innerHTML = `Selected: <strong>${escapeHtml(practiceSolutionFile.files[0].name)}</strong> <a href="#" class="clear-practice-file ms-2 small text-danger" title="Remove file" onclick="event.preventDefault();practiceSolutionFile.value=''; practiceSelectedFileInfo.innerHTML='';">Remove</a>`;
        } else { practiceSelectedFileInfo.innerHTML = ''; }
    });
}

if (solutionOutput) {
    solutionOutput.addEventListener('click', (event) => {
        const stepElement = event.target.closest('.interactive-step'); // Original class
        if (stepElement && currentSolutionText) {
            const stepNumber = stepElement.dataset.stepNumber;
            const stepContentElement = stepElement.querySelector('.step-content');
            const stepContentHTML = stepContentElement ? stepContentElement.innerHTML : '<p class="text-danger">Error: Could not extract step content.</p>';
            if (modalStepNumberInput) modalStepNumberInput.value = stepNumber;
            if (modalStepContent) modalStepContent.innerHTML = stepContentHTML;
            if (clarificationQuestion) clarificationQuestion.value = '';
            if (clarificationResult) clarificationResult.style.display = 'none';
            if (clarificationOutput) clarificationOutput.innerHTML = '';
            clearAlert(modalAlertBox);
            const modalTitle = clarifyStepModalElement?.querySelector('.modal-title');
            if (modalTitle) modalTitle.innerHTML = `<i class="bi bi-chat-left-text-fill me-2"></i>Clarify Step ${stepNumber}`;
            renderMathJax(modalStepContent); clarifyStepModal.show();
        }
    });
}

if (clarificationForm) {
    clarificationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); clearAlert(modalAlertBox);
        const stepNumber = modalStepNumberInput.value;
        const userQuestion = clarificationQuestion.value.trim();
        if (!userQuestion) { showAlert('Please enter your question.', 'warning', modalAlertBox); return; }
        if (!currentSolutionText || !stepNumber) { showAlert('Missing solution context. Please solve a problem first.', 'danger', modalAlertBox); return; }

        showModalLoading(); // Uses original function
        if (clarificationResult) clarificationResult.style.display = 'none'; if (clarificationOutput) clarificationOutput.innerHTML = '';

        const payload = { originalProblemText: currentProblemText, originalProblemFileURI: currentProblemFileURI, fullSolution: currentSolutionText, stepNumber: parseInt(stepNumber, 10), userQuestion };
        try {
            const response = await fetch(CLARIFY_API_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData?.error || responseData?.message || `HTTP error! Status: ${response.status}`);
            if (responseData.clarification) {
                const htmlClarification = simpleMarkdownToHtml(responseData.clarification);
                if (clarificationOutput) clarificationOutput.innerHTML = htmlClarification;

                if (clarificationResult) clarificationResult.style.display = 'block';
                renderMathJax(clarificationOutput); // Ensure MathJax processes the new conte
            } else { throw new Error("No clarification content received."); }
        } catch (error) {
            console.error('Error getting clarification:', error);
            showAlert(`Failed to get clarification: ${error.message}`, 'danger', modalAlertBox);
            if (clarificationOutput) clarificationOutput.innerHTML = ''; if (clarificationResult) clarificationResult.style.display = 'none';
        } finally {
            hideModalLoading(); // Uses original function
        }
    });
}

if (copySolutionButton && solutionOutput) { // Original logic
    copySolutionButton.addEventListener('click', () => {
        const textToCopy = solutionOutput.innerText || solutionOutput.textContent || '';
        const cleanedText = textToCopy.replace(/\s\s+/g, ' ').trim(); // Basic cleaning
        navigator.clipboard.writeText(cleanedText).then(() => {
            const originalText = copySolutionButton.textContent;
            const icon = copySolutionButton.querySelector('i');
            if (icon) icon.className = 'bi bi-check-lg me-1'; // Change to checkmark
            copySolutionButton.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.textContent = ' Copied!'; });
            copySolutionButton.disabled = true;
            setTimeout(() => {
                if (icon) icon.className = 'bi bi-clipboard me-1'; // Revert icon
                copySolutionButton.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.textContent = ' Copy Solution Text'; });
                copySolutionButton.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showAlert('Failed to copy solution text.', 'warning');
        });
    });
}

function renderChatHistory() { // Original logic, dashboard styles apply
    if (!chatWindow) return;
    chatWindow.innerHTML = '';
    if (conversationHistory.length === 0) {
        chatWindow.innerHTML = `<div class="sample-question-container"><h4><i class="bi bi-brain me-2"></i>गणित के सिद्धांतों के बारे में प्रोफेसर उल्लू से कुछ भी पूछें!</h4><p class="text-muted">उदाहरण:</p><div class="sample-question-chips"><div class="sample-question-chip" onclick="fillSampleQuestion('पाइथागोरस कौन थे?')">पाइथागोरस कौन थे?</div><div class="sample-question-chip" onclick="fillSampleQuestion('जटिल संख्याएँ समझाएँ')">जटिल संख्याएँ समझाएँ</div><div class="sample-question-chip" onclick="fillSampleQuestion('बराबरी के चिन्ह की उत्पत्ति?')">बराबरी के चिन्ह की उत्पत्ति?</div> <div class="sample-question-chip" onclick="fillSampleQuestion('यूक्लिड की एलिमेंट्स?')">यूक्लिड की एलिमेंट्स?</div></div></div>`;
    } else {
        conversationHistory.forEach(msg => {
            if (msg.role === 'user') {
                chatWindow.innerHTML += `<div class="user-message"><div>${escapeHtml(msg.content)}</div></div>`;
            } else if (msg.role === 'bot') {
                let botContent = msg.content.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code>$1</code>');
                chatWindow.innerHTML += `<div class="bot-message"><img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Owl Avatar"><div><b>Professor Owl:</b> ${botContent}</div></div>`;
            }
        });
    }
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
}
function fillSampleQuestion(q) { if (amaInput) { amaInput.value = q; amaInput.focus(); } }

async function sendQuestion() { // Original logic, uses `sendButton` ID
    if (!amaInput || !sendButton || !chatWindow) return;
    const question = amaInput.value.trim();
    if (!question) return;
    conversationHistory.push({ role: 'user', content: question });
    renderChatHistory(); amaInput.value = '';
    showButtonLoading(sendButton, 'Thinking...'); // Use generic helper

    const typingIndicator = document.createElement('div'); typingIndicator.id = 'typing';
    typingIndicator.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Owl Avatar"><div><span id="typing-text">Professor Owl is thinking</span><span id="dots">.</span></div>`;
    chatWindow.appendChild(typingIndicator); chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
    let dotsCount = 1; const typingInterval = setInterval(() => { dotsCount = (dotsCount % 3) + 1; const d = document.getElementById('dots'); if (d) d.innerText = '.'.repeat(dotsCount); }, 400);

    try {
        const response = await fetch(AMA_API_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ history: conversationHistory }) });
        const data = await response.json();
        if (response.ok && data.answer) { conversationHistory.push({ role: 'bot', content: data.answer }); }
        else { conversationHistory.push({ role: 'bot', content: `❌ ${escapeHtml(data.error || "Professor Owl couldn't find an answer. Try again!")}` }); }
    } catch (error) {
        console.error("Error in AMA chat:", error);
        conversationHistory.push({ role: 'bot', content: `🚫 Error contacting the server! Please check your connection or try again.` });
    } finally {
        clearInterval(typingInterval); const ti = document.getElementById('typing'); if (ti) ti.remove();
        renderChatHistory(); hideButtonLoading(sendButton); // Use generic helper
    }
}
if (amaInput) amaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendQuestion(); } });
if (sendButton) sendButton.addEventListener('click', sendQuestion);

document.addEventListener('DOMContentLoaded', () => {
    if (displayAllStepsRadio) {
        displayAllStepsRadio.addEventListener('change', () => {
            if (displayAllStepsRadio.checked) { currentStepIndex = 0; renderSolutionSteps('all'); }
        });
    }
    if (displayOneByOneRadio) {
        displayOneByOneRadio.addEventListener('change', () => {
            if (displayOneByOneRadio.checked) { renderSolutionSteps('one-by-one'); }
        });
    }
    if (nextStepButton) { // Original index.html listener for nextStepButton
        nextStepButton.addEventListener('click', () => {
            if (currentStepIndex < currentSolutionStepsArray.length - 1) {
                currentStepIndex++;
                renderSolutionSteps('one-by-one');
            }
        });
    }

    if (mathProblemText) setTimeout(() => mathProblemText.dispatchEvent(new Event('input')), 100);
    if (practiceSlider && practiceCount) practiceCount.textContent = practiceSlider.value;
    renderChatHistory();
    document.querySelectorAll('section, header, footer').forEach(el => el.classList.add('fade-in'));
    if (practiceLoading) practiceLoading.style.display = 'none';
    updateSolveButtonState();
    if (hintsSection) hintsSection.style.display = 'none'; // Hide hints initially
    if (conceptsRefresherSection) conceptsRefresherSection.style.display = 'none';
    if (practiceProblemsSectionCard) practiceProblemsSectionCard.style.display = 'none';
    const solutionCard = document.getElementById('solution-display-card');
    if (solutionCard) solutionCard.style.display = 'none';
    if (solutionOutput) solutionOutput.innerHTML = '<p class="text-muted">Your step-by-step solution will appear here...</p>';
    if (uploadedQuestionImagePreviewArea) uploadedQuestionImagePreviewArea.style.display = 'none';
    if (preemptiveScaffoldingDiv) preemptiveScaffoldingDiv.style.display = 'none';


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
