var editElements = $('.edit');
var pageId;

function generateUniqueId() {
  var currentPage = window.location.pathname.split("/").pop();
  pageId = currentPage.replace('.html', '');
  localStorage.setItem('pageId', pageId);
}

function myFunction() {
  let pass = prompt("Please enter your password");
  if (pass === "000") {
    alert("Recommend edit content in Microsoft Word, then copy to website.\n • Big heading: font: Source Serif Pro, size: 37.5 \n • Small heading: font:Source Serif Pro, size 21. \n • Text: font:Calibri Light (Headings), size 12 \n\nAfter edit, click save and upload the downloaded file in ./js/json on github page ");
    
    editElements.attr('contentEditable', true);
    editElements.css('border', '1px solid blue');

    document.getElementById('saveBtn').style.display = 'inline-block';
    document.getElementById('disableBtn').style.display = 'inline-block';
    document.getElementById('enableBtn').style.display = 'inline-block';
    document.getElementById('exportBtn').style.display = 'inline-block';
  } else {
    alert("Incorrect password.");
  }
}

function mySave() {
  var editedContents = [];

  editElements.each(function(index) {
    var html = $(this).html();
    var key = 'newContent_' + pageId + '_' + (index + 1);
    localStorage.setItem(key, html);
    editedContents.push(html);
  });

  var contentsJson = JSON.stringify(editedContents);
  var blob = new Blob([contentsJson], { type: 'application/json' });
  saveAs(blob, 'localStorageData_' + pageId + '.json');

  alert("Content saved and exported to JSON.");
  editElements.attr('contenteditable', 'false');
  editElements.css('border', 'transparent');
}

function restoreContent() {
  editElements.each(function(index) {
    var key = 'newContent_' + pageId + '_' + (index + 1);
    var savedContent = localStorage.getItem(key);
    if (savedContent) {
      $(this).html(savedContent);
    }
  });

  var importedData = localStorage.getItem('importedData');
  if (importedData) {
    var parsedData = JSON.parse(importedData);
    editElements.each(function(index) {
      $(this).html(parsedData[index]);
    });
  }
}

function disableRestore() {
  localStorage.setItem('global_disableRestore', 'true');
  alert("Restore from JSON is now disabled for ALL pages. Reload to see hard-coded HTML.");
}

function enableRestore() {
  localStorage.removeItem('global_disableRestore');
  alert("Restore from JSON is now enabled for ALL pages. Reload the page to apply changes.");
}

function exportEditedHTML() {
  let fullHTML = document.documentElement.cloneNode(true);

  $(fullHTML).find('.edit').each(function(index) {
    var key = 'newContent_' + pageId + '_' + (index + 1);
    var savedContent = localStorage.getItem(key);
    if (savedContent) {
      this.innerHTML = savedContent;
    }
  });

  var serializer = new XMLSerializer();
  var fullHTMLString = '<!DOCTYPE html>\n' + serializer.serializeToString(fullHTML);
  var blob = new Blob([fullHTMLString], { type: 'text/html' });

  saveAs(blob, pageId + '_edited.html');
  alert("Full HTML page exported with saved edits.");
}

window.onload = () => {
  const anchors = document.querySelectorAll('a');
  const transition_el = document.querySelector('.transition');

  setTimeout(() => {
    generateUniqueId();

    const disable = localStorage.getItem('global_disableRestore');
    if (!disable) {
      restoreContent();

      fetch('https://trantunhi99.github.io/web/js/json/localStorageData_' + pageId + '.json')
        .then(response => {
          if (!response.ok) throw new Error('JSON file not found');
          return response.json();
        })
        .then(parsedData => {
          localStorage.setItem('importedData', JSON.stringify(parsedData));
          restoreContent();
          console.log('JSON file fetched and imported successfully.');
          transition_el.classList.remove('is-active');
        })
        .catch(error => {
          console.error('Error fetching JSON file:', error);
          const errorContainer = document.getElementById('error');
          if (errorContainer) errorContainer.textContent = 'Error: JSON file not found.';
        });
    } else {
      console.log("Restore from JSON is globally disabled.");
      transition_el.classList.remove('is-active');
    }
  }, 500);

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.addEventListener('click', e => {
      e.preventDefault();
      let target = e.target.href;
      transition_el.classList.add('is-active');
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    });
  }
};

// --- Image slider logic ---

const images = [
  "./assets/loki_framework.png",
  "./assets/cell_dancer_framework.png"
];
let currentIndex = 0;
let lastHoverTime = 0;

function changeSlide(direction) {
  const now = Date.now();
  if (now - lastHoverTime < 1000) return;
  lastHoverTime = now;

  const img = document.getElementById("slide-img");
  img.style.opacity = 0;

  setTimeout(() => {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    img.src = images[currentIndex];
    img.style.opacity = 1;
  }, 300);
}

// --- Hint overlay logic ---

const hint = document.querySelector('.hover-hint');
const container = document.querySelector('.slider-container');
let isHovering = false;

container.addEventListener('mouseenter', () => isHovering = true);
container.addEventListener('mouseleave', () => isHovering = false);

function showHint() {
  if (!isHovering) {
    hint.classList.add('show');
    setTimeout(() => hint.classList.remove('show'), 2000);
  }
}

window.addEventListener('load', () => {
  showHint(); // show once on load
  setInterval(showHint, 10000); // then every 10s
});
