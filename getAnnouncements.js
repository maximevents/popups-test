// Include jQuery
var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
script.onload = function() {
  $(document).ready(function() {
    // Function to create and display popup
    function displayPopup(content) {
      // Create popup container
      var popup = $('<div id="custom-popup"></div>');
      
      // Create popup content
      var popupContent = $('<div class="popup-content"></div>');
      
      // Add close button
      var closeButton = $('<button class="close-btn">&times;</button>');
      popupContent.append(closeButton);
      
      // Add image
      if (content.imageUrl) {
        var image = $('<img>').attr('src', content.imageUrl).addClass('popup-image');
        popupContent.append(image);
      }
      
      // Add text content
      var textContent = $('<div class="text-content"></div>');
      textContent.append($('<h2>').text(content.title));
      textContent.append($('<h3>').text(content.subheading));
      textContent.append($('<p>').text(content.description));
      popupContent.append(textContent);
      
      // Add popup content to popup container
      popup.append(popupContent);
      
      // Add popup to body
      $('body').append(popup);
      
      // Show popup with fade in effect
      popup.fadeIn();
      
      // Close popup on close button click
      closeButton.on('click', function() {
        popup.fadeOut(function() {
          $(this).remove();
        });
      });
    }
    
    // CSS styles for popup
    var popupStyles = `
      #custom-popup {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
      }
      .popup-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
        border-radius: 5px;
        margin-bottom: 15px;
      }
      .text-content h2 {
        margin-top: 0;
        color: #333;
      }
      .text-content h3 {
        color: #666;
      }
      .text-content p {
        color: #444;
        line-height: 1.6;
      }
    `;
    
    // Create a <style> element and append CSS styles to it
    var styleElement = $('<style>').text(popupStyles);
    $('head').append(styleElement);
    
    // Function to fetch popup content from Cloud Function
    function fetchPopupContent() {
      $.ajax({
        url: 'https://asia-southeast1-kl-lightning.cloudfunctions.net/getAnnouncements',
        method: 'GET',
        success: function(data) {
          displayPopup(data);
        },
        error: function(error) {
          console.error('Error fetching popup content:', error);
        }
      });
    }
    
    // Fetch popup content on document ready
    fetchPopupContent();
  });
};
document.head.appendChild(script);
