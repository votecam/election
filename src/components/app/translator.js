/**
 * Multi-language translator using Google Translate API
 * Integrates with the language selector dropdown in the header
 */

// Configuration
export const translationConfig = {
    // Language codes mapping
    languages: {
      en: { name: 'English', isDefault: false },
      fr: { name: 'French', isDefault: false }
    },
    // API URL
    apiUrl: 'https://translate.googleapis.com/translate_a/single',
    // DOM elements to ignore during translation
    ignoreClasses: ['no-translate', 'fa-', 'fas-', 'fab-'],
    // Elements to skip translation
    ignoreElements: [],
    // Store translations to avoid unnecessary API calls
    cache: {}
  };
  
  // Translation state management
  let translationState = {
    isTranslating: false,
    currentLanguage: 'en',
    pendingTranslations: new Set(),
    translationQueue: [],
    lastTranslationTime: 0
  };
  
  // Initialize language on page load
  function initializeLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const languageSelector = document.getElementById('languageSelector');
    
    if (languageSelector) {
      // Set the selector to the saved language
      if (savedLanguage && translationConfig.languages[savedLanguage]) {
        languageSelector.value = savedLanguage;
        
        // If not English, translate the page immediately
        if (savedLanguage) {
          translatePage(savedLanguage);
        }
      }
    }
  }
  
  /**
   * Main function to initialize the translator
   */
  export function initTranslator() {
    // Initialize language
    initializeLanguage();
    
    // Select the language dropdown
    const languageSelector = document.getElementById('languageSelector');
    if (!languageSelector) {
      console.error('Language selector not found');
      return;
    }
  
    // Add event listener to language selector for immediate translation
    languageSelector.addEventListener('change', function() {
      const targetLang = this.value;
      
      // Save language preference
      localStorage.setItem('selectedLanguage', targetLang);
      
      // If the selected language is English, reload the page
      if (targetLang === 'en') {
        window.location.reload();
        return;
      }
      
      // Show loading indicator
      showTranslationLoading();
      
      // Translate or restore content
      translatePage(targetLang)
        .then(() => {
          hideTranslationLoading();
        })
        .catch(err => {
          console.error("Translation error:", err);
          hideTranslationLoading();
        });
    });
  
    // Listen for React Router navigation
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      window.history.pushState = function() {
        originalPushState.apply(this, arguments);
        handlePageNavigation();
      };

      window.addEventListener('popstate', handlePageNavigation);
    }
  
    // Listen for React Router navigation events
    document.addEventListener('click', handleLinkClick);
  }
  
  // Handle page navigation
  function handlePageNavigation() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== 'en') {
      // Wait for React to finish rendering
      setTimeout(() => {
        translatePage(savedLanguage);
      }, 300);
    }
  }
  
  // Handle link clicks for client-side navigation
  function handleLinkClick(event) {
    const link = event.target.closest('a');
    if (link && !link.target && !event.ctrlKey && !event.metaKey) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage && savedLanguage !== 'en') {
        // Wait for React to finish rendering
        setTimeout(() => {
          translatePage(savedLanguage);
        }, 300);
      }
    }
  }
  
  /**
   * Show translation loading indicator
   */
  export function showTranslationLoading() {
    if (!document.getElementById('translation-loading')) {
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'translation-loading';
      loadingDiv.innerHTML = `
        <div class="translation-loading-spinner">
          <div class="spinner-container">
            <div class="spinner"></div>
          </div>
          <p>Translating content...</p>
        </div>
      `;
      loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.98);
        padding: 1.5rem 2rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        justify-content: center;
      `;
      document.body.appendChild(loadingDiv);
      
      // Add spinner styles
      const style = document.createElement('style');
      style.textContent = `
        .translation-loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .spinner-container {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .spinner {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          border-top: 3px solid #059669;
          animation: spin 0.8s linear infinite;
        }
        
        .spinner::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border: 3px solid rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .translation-loading-spinner p {
          color: #059669;
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          text-align: center;
        }
      `;
      document.head.appendChild(style);
    }
    
    const loadingDiv = document.getElementById('translation-loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'flex';
      // Add fade-in animation
      loadingDiv.style.animation = 'fadeIn 0.3s ease-out';
      const fadeInStyle = document.createElement('style');
      fadeInStyle.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `;
      document.head.appendChild(fadeInStyle);
    }
  }
  
  /**
   * Hide translation loading indicator
   */
  export function hideTranslationLoading() {
    const loadingDiv = document.getElementById('translation-loading');
    if (loadingDiv) {
      // Add fade-out animation
      loadingDiv.style.animation = 'fadeOut 0.3s ease-out';
      const fadeOutStyle = document.createElement('style');
      fadeOutStyle.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; transform: translate(-50%, -50%); }
          to { opacity: 0; transform: translate(-50%, -52%); }
        }
      `;
      document.head.appendChild(fadeOutStyle);
      
      // Remove the element after animation
      setTimeout(() => {
        loadingDiv.style.display = 'none';
      }, 300);
    }
  }
  
  /**
   * Translate the entire page content
   * @param {string} targetLang - Target language code
   * @returns {Promise} - Promise that resolves when translation is complete
   */
  export function translatePage(targetLang) {
    return new Promise(async (resolve, reject) => {
      try {
        // Store original content before translation if not already stored
        if (!document.body.hasAttribute('data-original-stored')) {
          const textNodes = getTranslatableTextNodes(document.body);
          textNodes.forEach(node => {
            const parent = node.parentElement;
            if (parent && !parent.hasAttribute('data-original')) {
              parent.setAttribute('data-original', node.nodeValue);
            }
          });
          document.body.setAttribute('data-original-stored', 'true');
        }

        // Update ignore elements based on the target language
        updateIgnoreElements(targetLang);
        
        // If switching back to English, restore original content
        if (targetLang === 'en') {
          document.querySelectorAll('[data-original]').forEach(el => {
            const originalText = el.getAttribute('data-original');
            if (originalText) {
              el.textContent = originalText;
              el.removeAttribute('data-translated');
            }
          });
          resolve();
          return;
        }

        // Collect all text nodes that need translation
        const textNodes = getTranslatableTextNodes(document.body);
        const textBlocks = [];
        const nodeMap = new Map();
        
        // Group text nodes into larger blocks for efficient API usage
        let currentBlock = '';
        let currentNodes = [];
        
        textNodes.forEach(node => {
          // Skip very short text or text that might be code
          const text = node.nodeValue.trim();
          if (text.length < 2 || shouldSkipTranslation(node)) return;
          
          // Add to current block
          currentBlock += text + '\n';
          currentNodes.push(node);
          
          // When block reaches enough size, push to array and reset
          if (currentBlock.length > 500) {
            textBlocks.push({
              text: currentBlock,
              nodes: [...currentNodes]
            });
            currentBlock = '';
            currentNodes = [];
          }
        });
        
        // Push remaining block if any
        if (currentBlock.length > 0) {
          textBlocks.push({
            text: currentBlock,
            nodes: [...currentNodes]
          });
        }
        
        // Translate all blocks and update DOM
        await translateBlocks(textBlocks, targetLang);
        
        // Find and translate attributes like placeholders, alt text, etc.
        await translateAttributes(targetLang);
        
        resolve();
      } catch (error) {
        console.error('Translation error:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Update the ignore elements list based on the target language
   * @param {string} targetLang - Target language code
   */
  function updateIgnoreElements(targetLang) {
    // Reset ignore elements
    translationConfig.ignoreElements = [];
    
    // For French language, add siteName to ignore elements
    if (targetLang === 'fr') {
      translationConfig.ignoreElements.push('#siteName');
    }
  }
  
  /**
   * Translate multiple blocks of text and update corresponding nodes
   * @param {Array} blocks - Array of text blocks with their nodes
   * @param {string} targetLang - Target language code
   */
  async function translateBlocks(blocks, targetLang) {
    // Process blocks in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < blocks.length; i += batchSize) {
      const batch = blocks.slice(i, i + batchSize);
      const promises = batch.map(block => translateAndUpdateNodes(block, targetLang));
      await Promise.all(promises);
      
      // Add a small delay between batches
      if (i + batchSize < blocks.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }
  
  /**
   * Translate a block of text and update the corresponding DOM nodes
   * @param {Object} block - Block of text with associated nodes
   * @param {string} targetLang - Target language code
   */
  async function translateAndUpdateNodes(block, targetLang) {
    try {
      const sourceLang = 'en'; // Assuming English is the source language
      const translatedText = await translateText(block.text, sourceLang, targetLang);
      
      if (!translatedText) return;
      
      // Split translated text into paragraphs
      const translatedParts = translatedText.split('\n');
      let partIndex = 0;
      
      // Update each node with its translated part
      for (const node of block.nodes) {
        if (partIndex < translatedParts.length) {
          const originalText = node.nodeValue.trim();
          if (originalText.length > 0) {
            // Preserve spacing in the original text
            const leadingSpaces = node.nodeValue.match(/^\s*/)[0];
            const trailingSpaces = node.nodeValue.match(/\s*$/)[0];
            node.nodeValue = leadingSpaces + translatedParts[partIndex] + trailingSpaces;
            partIndex++;
          }
        }
      }
    } catch (error) {
      console.error('Error translating block:', error);
    }
  }
  
  /**
   * Translate common HTML attributes like placeholders, alt text, etc.
   * @param {string} targetLang - Target language code
   */
  async function translateAttributes(targetLang) {
    // Find elements with attributes that should be translated
    const attributesToTranslate = [
      { selector: '[placeholder]', attr: 'placeholder' },
      { selector: 'img[alt]:not([alt=""])', attr: 'alt' },
      { selector: '[title]:not([title=""])', attr: 'title' },
      { selector: 'input[type="submit"], button:not(.no-translate)', attr: 'value' }
    ];
    
    const promises = [];
    
    attributesToTranslate.forEach(item => {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(el => {
        // Skip elements that should be ignored
        if (shouldSkipElement(el)) return;
        
        const originalText = el.getAttribute(item.attr);
        if (originalText && originalText.length > 1) {
          promises.push((async () => {
            try {
              const translatedText = await translateText(originalText, 'en', targetLang);
              if (translatedText) {
                el.setAttribute(item.attr, translatedText);
              }
            } catch (error) {
              console.error(`Error translating ${item.attr}:`, error);
            }
          })());
        }
      });
    });
    
    await Promise.all(promises);
  }
  
  /**
   * Check if an element should be skipped for translation
   * @param {Element} element - DOM element
   * @returns {boolean} - True if element should be skipped
   */
  function shouldSkipElement(element) {
    // Check if element matches any of the ignore selectors
    return translationConfig.ignoreElements.some(selector => {
      return element.matches(selector) || element.closest(selector);
    });
  }
  
  /**
   * Check if a node should be skipped for translation
   * @param {Node} node - DOM text node
   * @returns {boolean} - True if node should be skipped
   */
  function shouldSkipTranslation(node) {
    // Skip if node or parent has a class in the ignore list
    const parent = node.parentElement;
    if (!parent) return false;
    
    // Check if node is in a script, style, code or pre tag
    const tagName = parent.tagName.toLowerCase();
    if (['script', 'style', 'code', 'pre'].includes(tagName)) {
      return true;
    }
    
    // Check if node or any parent has the no-translate class
    let currentElement = parent;
    while (currentElement) {
      if (currentElement.classList && currentElement.classList.contains('no-translate')) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    
    // Check if node has any of the ignored classes
    if (parent.className) {
      return translationConfig.ignoreClasses.some(cls => 
        parent.className.includes(cls)
      );
    }
    
    // Check if node is inside an element that should be ignored
    return translationConfig.ignoreElements.some(selector => {
      return parent.matches(selector) || parent.closest(selector);
    });
  }
  
  /**
   * Get all translatable text nodes from an element
   * @param {Element} element - DOM element to get text nodes from
   * @returns {Array} - Array of text nodes
   */
  function getTranslatableTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip empty text nodes or nodes that should be ignored
          if (!node.nodeValue.trim() || shouldSkipTranslation(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    const textNodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
      textNodes.push(currentNode);
    }
    
    return textNodes;
  }
  
  /**
   * Process translation queue with optimized rate limiting
   */
  async function processTranslationQueue() {
    if (translationState.isTranslating || translationState.translationQueue.length === 0) {
      return;
    }

    translationState.isTranslating = true;
    
    try {
      while (translationState.translationQueue.length > 0) {
        const now = Date.now();
        const timeSinceLastTranslation = now - translationState.lastTranslationTime;
        
        if (timeSinceLastTranslation < translationConfig.apiDelay) {
          await new Promise(resolve => 
            setTimeout(resolve, translationConfig.apiDelay - timeSinceLastTranslation)
          );
        }
        
        // Process multiple translations in parallel
        const batch = translationState.translationQueue.splice(0, translationConfig.batchSize);
        const promises = batch.map(({ text, sourceLang, targetLang, resolve, reject }) => 
          translateText(text, sourceLang, targetLang)
            .then(resolve)
            .catch(reject)
        );
        
        await Promise.all(promises);
        translationState.lastTranslationTime = Date.now();
      }
    } finally {
      translationState.isTranslating = false;
    }
  }
  
  /**
   * Queue a translation request
   */
  function queueTranslation(text, sourceLang, targetLang) {
    return new Promise((resolve, reject) => {
      translationState.translationQueue.push({
        text,
        sourceLang,
        targetLang,
        resolve,
        reject
      });
      
      processTranslationQueue();
    });
  }
  
  /**
   * Translate text using Google Translate API
   */
  async function translateText(text, sourceLang, targetLang) {
    // Check cache first
    const cacheKey = `${sourceLang}_${targetLang}_${text}`;
    if (translationConfig.cache[cacheKey]) {
      return translationConfig.cache[cacheKey];
    }

    try {
      // Prepare API parameters
      const params = new URLSearchParams({
        client: 'gtx',
        sl: sourceLang,
        tl: targetLang,
        dt: 't',
        q: text
      });

      const response = await fetch(`${translationConfig.apiUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      
      if (data && data[0]) {
        const translatedText = data[0]
          .filter(chunk => chunk && chunk[0])
          .map(chunk => chunk[0])
          .join('');

        // Store in cache
        translationConfig.cache[cacheKey] = translatedText;
        return translatedText;
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
  
  // Initialize the translator when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize immediately
    initTranslator();
    
    // Check for saved language and translate if needed
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== 'en') {
      translatePage(savedLanguage);
    }
  });

  // Also initialize on page load for non-SPA navigation
  window.addEventListener('load', function() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== 'en') {
      translatePage(savedLanguage);
    }
  });

  // Add MutationObserver to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== 'en') {
      // Check if the mutation added new content
      const hasNewContent = mutations.some(mutation => 
        mutation.addedNodes.length > 0 && 
        mutation.addedNodes[0].nodeType === Node.ELEMENT_NODE
      );
      
      if (hasNewContent) {
        translatePage(savedLanguage);
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

export function changeLanguage(language) {
  // Save language preference
  localStorage.setItem('selectedLanguage', language.code);
  
  // Update language selector if it exists
  const languageSelector = document.getElementById('languageSelector');
  if (languageSelector) {
    languageSelector.value = language.code;
  }

  // If English is selected, refresh the page
  if (language.code === 'en') {
    window.location.reload();
    return;
  }

  // Show loading indicator
  showTranslationLoading();

  // Use the existing translator
  translatePage(language.code)
    .then(() => {
      // Hide loading indicator when translation is complete
      hideTranslationLoading();
    })
    .catch(err => {
      console.error("Translation error:", err);
      hideTranslationLoading();
    });
}