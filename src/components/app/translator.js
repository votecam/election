/**
 * Multi-language translator using Google Translate API
 * Integrates with the language selector dropdown in the header
 */

// Configuration
export const translationConfig = {
    // Language codes mapping
    languages: {
      en: { name: 'English', isDefault: true },
      ha: { name: 'Hausa', isDefault: false },
      yo: { name: 'Yoruba', isDefault: false },
      ig: { name: 'Igbo', isDefault: false },
      fr: { name: 'French', isDefault: false }
    },
    // API URL
    apiUrl: 'https://translate.googleapis.com/translate_a/single',
    // DOM elements to ignore during translation (add more as needed)
    ignoreClasses: ['no-translate', 'fa-', 'fas-', 'fab-'],
    // Elements to skip translation
    ignoreElements: [],
    // Store translations to avoid unnecessary API calls
    cache: {}
  };
  
  /**
   * Main function to initialize the translator
   */
  export function initTranslator() {
    // Select the language dropdown
    const languageSelector = document.getElementById('languageSelector');
    if (!languageSelector) {
      console.error('Language selector not found');
      return;
    }
  
    // Load preferred language from localStorage if available
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && translationConfig.languages[savedLanguage]) {
      languageSelector.value = savedLanguage;
      
      // If not default language, translate the page
      if (!translationConfig.languages[savedLanguage].isDefault) {
        translatePage(savedLanguage);
      }
    }
  
    // Add event listener to language selector for immediate translation
    languageSelector.addEventListener('change', function() {
      const targetLang = this.value;
      
      // Save language preference
      localStorage.setItem('selectedLanguage', targetLang);
      
      // Show loading indicator
      showTranslationLoading();
      
      // If English (default) is selected, reload the page to show original content
      if (translationConfig.languages[targetLang].isDefault) {
        location.reload();
        return;
      }
      
      // Translate the page immediately
      translatePage(targetLang).then(() => {
        // Hide loading indicator when translation is complete
        hideTranslationLoading();
        // Reload the page after successful translation
        location.reload();
      }).catch(err => {
        console.error("Translation error:", err);
        hideTranslationLoading();
      });
    });
  
    // Initialize nice-select if it exists
    if ($.fn.niceSelect) {
      // Destroy and reinitialize nice-select
      $('.country-select').niceSelect('destroy');
      $('.country-select').niceSelect();
      
      // Add event listener to the nice-select dropdown items for immediate translation
      $('.nice-select .option').on('click', function() {
        const targetLang = $(this).data('value');
        languageSelector.value = targetLang;
        
        // Trigger the change event manually to start translation immediately
        const event = new Event('change');
        languageSelector.dispatchEvent(event);
      });
    }
  }
  
  /**
   * Show translation loading indicator
   */
  export function showTranslationLoading() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('translation-loading')) {
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'translation-loading';
      loadingDiv.innerHTML = `
        <div class="translation-loading-container">
          <div class="translation-loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <div class="translation-loading-text">
            <p class="text-emerald-700 font-medium">Translating content...</p>
            <p class="text-emerald-600 text-sm">Please wait while we translate the page</p>
          </div>
        </div>
      `;
      loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;
      document.body.appendChild(loadingDiv);
      
      // Add spinner styles
      const style = document.createElement('style');
      style.textContent = `
        .translation-loading-container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.1);
          min-width: 300px;
        }
        
        .translation-loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
        }
        
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        
        .spinner-ring:nth-child(1) {
          border-top-color: #059669;
          animation-delay: -0.45s;
        }
        
        .spinner-ring:nth-child(2) {
          border-right-color: #10b981;
          animation-delay: -0.3s;
        }
        
        .spinner-ring:nth-child(3) {
          border-bottom-color: #34d399;
          animation-delay: -0.15s;
        }
        
        .spinner-ring:nth-child(4) {
          border-left-color: #6ee7b7;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .translation-loading-text {
          margin-top: 1rem;
        }
        
        .translation-loading-text p {
          margin: 0.25rem 0;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Always show the loading div
    const loadingDiv = document.getElementById('translation-loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'flex';
      loadingDiv.style.opacity = '1';
      loadingDiv.style.visibility = 'visible';
    }
  }
  
  /**
   * Hide translation loading indicator
   */
  export function hideTranslationLoading() {
    const loadingDiv = document.getElementById('translation-loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
      loadingDiv.style.opacity = '0';
      loadingDiv.style.visibility = 'hidden';
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
        // Update ignore elements based on the target language
        updateIgnoreElements(targetLang);
        
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
        alert('Translation failed. Please try again later.');
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
    
    // For Hausa, French, Yoruba and Igbo languages, add siteName to ignore elements
    // This will prevent the organization name from being translated
    if (targetLang === 'ha' || targetLang === 'fr' || targetLang === 'yo' || targetLang === 'ig') {
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
   * Translate text using Google Translate API
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code
   * @param {string} targetLang - Target language code
   * @returns {Promise<string>} - Translated text
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
        client: 'gtx',  // Use the free API client
        sl: sourceLang, // Source language
        tl: targetLang, // Target language
        dt: 't',        // Return the translation
        q: text         // Text to translate
      });
  
      const response = await fetch(`${translationConfig.apiUrl}?${params.toString()}`);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} (${response.status})`);
      }
  
      const data = await response.json();
      
      // Google Translate API returns a nested array structure
      if (data && data[0]) {
        // Extract and join all translated parts
        const translatedText = data[0]
          .filter(chunk => chunk && chunk[0])
          .map(chunk => chunk[0])
          .join('');
        
        // Store in cache
        translationConfig.cache[cacheKey] = translatedText;
        return translatedText;
      } else {
        return text; // Return original if translation failed
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        console.warn('CORS error: API cannot be accessed directly from browser. Try running with a local server.');
      }
      
      return text; // Return original if translation failed
    }
  }
  
  // Initialize the translator when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize immediately
    initTranslator();
    
    // Also handle direct clicks on the select element
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
      // Add click handler to each option
      languageSelector.querySelectorAll('option').forEach(option => {
        option.addEventListener('click', function() {
          const targetLang = this.value;
          languageSelector.value = targetLang;
          
          // Trigger change event immediately
          const event = new Event('change');
          languageSelector.dispatchEvent(event);
        });
      });
    }
  });

export function changeLanguage(language) {
  setCurrentLanguage(language);
  localStorage.setItem('selectedLanguage', language.code);
  
  // If English is selected, just reload the page immediately
  if (language.code === 'en') {
    location.reload();
    return;
  }

  // Show loading indicator
  showTranslationLoading();

  // Use the existing translator
  translatePage(language.code)
    .then(() => {
      // Hide loading indicator when translation is complete
      hideTranslationLoading();
      // Reload the page after successful translation
      location.reload();
    })
    .catch(err => {
      console.error("Translation error:", err);
      hideTranslationLoading();
    });

  closeAllDropdowns();
}