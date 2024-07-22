// Include jQuery
var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
script.onload = function() {
  $(document).ready(function() {
    // Function to create and display popup
    function displayPopup(content) {
      // Create popup container
      var popup = $('<div id="custom-popup" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>');
      
      // Create popup content
      var popupContentWrapper = $('<div class="fixed inset-0 z-10 w-screen overflow-y-auto flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"></div>');
      var popupContent = $('<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"></div>');
      
      // Add close button
      var closeButton = $('<button class="close-btn">&times;</button>');
      
      // Add image
      if (content.imageUrl) {
        var image = $('<img>').attr('src', content.imageUrl).addClass('popup-image');
        popupContent.append(image);
      }
      
      // Add text content
      var textContent = $('<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"></div>');
      var title = $('<h3 class="text-base font-semibold leading-6 text-gray-900"></h3>').text(content.title);
      var subheading = $('<h4 class="text-sm text-gray-500"></h4>').text(content.subheading);
      var description = $('<p class="mt-2 text-sm text-gray-500"></p>').text(content.description);

      textContent.append(title).append(subheading).append(description);
      popupContent.append(textContent);
      
      // Add popup content to wrapper and container
      popupContentWrapper.append(popupContent);
      popup.append(popupContentWrapper);
      
      // Add popup to body
      $('body').append(popup);
      
      // Show popup with fade in effect
      popup.fadeIn();
      
      // Close popup on close button click
      closeButton.on('click', closePopup);
      
      // Close popup on overlay click
      popup.on('click', function(e) {
        if (e.target === this) {
          closePopup();
        }
      });

      function closePopup() {
        popup.fadeOut(function() {
          $(this).remove();
        });
      }
    }
    
    // CSS styles for popup
    var popupStyles = `
      #custom-popup {
        display: none;
      }
      .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        background: none;
        border: none;
        cursor: pointer;
      }
      .popup-image {
        width: 100%;
        height: auto;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .bg-white {
        background-color: white;
      }
      .text-gray-500 {
        color: #6b7280;
      }
      .text-gray-900 {
        color: #111827;
      }
      .rounded-lg {
        border-radius: 0.5rem;
      }
      .shadow-xl {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .transition-all {
        transition: all 0.3s ease-out;
      }
      .sm\\:my-8 {
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
      .sm\\:w-full {
        width: 100%;
      }
      .sm\\:max-w-lg {
        max-width: 32rem;
      }
      .text-center {
        text-align: center;
      }
      .p-4 {
        padding: 1rem;
      }
      .sm\\:p-0 {
        padding: 0;
      }
      .pb-4 {
        padding-bottom: 1rem;
      }
      .pt-5 {
        padding-top: 1.25rem;
      }
      .sm\\:pb-4 {
        padding-bottom: 1rem;
      }
      .sm\\:p-6 {
        padding: 1.5rem;
      }
      .relative {
        position: relative;
      }
      .overflow-hidden {
        overflow: hidden;
      }
      .min-h-full {
        min-height: 100%;
      }
      .items-end {
        align-items: flex-end;
      }
      .justify-center {
        justify-content: center;
      }
      .flex {
        display: flex;
      }
    `;
    
    // Create a <style> element and append CSS styles to it
    var styleElement = $('<style>').text(popupStyles);
    $('head').append(styleElement);
    
    // Function to check if popup should be shown
    function shouldShowPopup() {
      const lastShown = localStorage.getItem('lastPopupShown');
      const now = new Date().getTime();
      
      // Show popup if it's never been shown or it's been more than 24 hours
      if (!lastShown || now - lastShown > 24 * 60 * 60 * 1000) {
        localStorage.setItem('lastPopupShown', now);
        return true;
      }
      return false;
    }

    // Function to fetch popup content from Cloud Function
    function fetchAnnouncementContent() {
      // Get the website ID from the script tag
      var websiteId = $('script[data-website-id]').attr('data-website-id');
      
      if (!websiteId) {
        console.error('Website ID not found');
        return;
      }

      $.ajax({
        url: 'https://asia-southeast1-kl-lightning.cloudfunctions.net/getAnnouncements',
        method: 'GET',
        data: { website: websiteId },
        success: function(data) {
          if (shouldShowPopup()) {
            displayPopup(data);
          }
        },
        error: function(error) {
          console.error('Error fetching announcement content:', error);
        }
      });
    }
    
    // Fetch announcement content on document ready
    fetchAnnouncementContent();
  });
};
document.head.appendChild(script);
