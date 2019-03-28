// States
// 

(function ($){
  window.numberArray = [],
  window.phoneNumber = '',
  window.updateDisplay,
  window.numberDisplayEl,
  window.inCallModeActive,
  window.dialpadButton = $('div#dialpad li'),
  window.dialpadCase = $('div#dialpad'),
  window.clearButton = $('#actions .clear'),
  window.callButton = $('#actions .call'),
  window.actionButtons = $('#actions'),
  window.skipButton = $('#actions .skip'),
  window.numberDisplayEl = $('#numberDisplay input');

  var contactID = "";
  function compilePhoneNumber(numberArray){
    if (window.numberArray.length > 1){ 
      window.phoneNumber = window.numberArray.join('');
    } else {
      window.phoneNumber = window.numberArray
    }
    return this.phoneNumber;
  };

  function updateDisplay(phoneNumber){
    window.numberDisplayEl.val(window.phoneNumber);
  };

  function clearPhoneNumber(){
    window.numberDisplayEl.val('');
    window.phoneNumber = '';
    window.numberArray = [];
  };

  function callNumber(){
    var phone_number = window.numberDisplayEl.val();
    if(phone_number==""){
      return;
    }
    $.ajax({
      url: '/call',
      dataType: 'json',
      type: 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: {phone_number: phone_number},
      success: function( data, textStatus, jQxhr ){
          window.numberDisplayEl.val('Calling...');
          activateInCallInterface();
          console.log('Request succeeded with JSON response', data);
          contactID = data.contactID;
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log('Request failed', errorThrown);
          disableInCallInterface();
      }
    });
    // Need timer interval to animate . . .
    // Trigger  "Hangup"
    // Trigger  "Call timer"
  };

  function holdNumber(){
    window.numberDisplayEl.val('On Hold.');
    changeHoldIntoUnhold();
  };

  function changeHoldIntoUnhold(){
    window.skipButton.html('Unhold');
    window.skipButton.addClass('ready');
  };

  function changeUnholdIntoHold(){
    window.skipButton.html('Hold');
  };

  function activateInCallInterface(){
    changeClearIntoHangUp();
    changeSkipIntoHold();
    disableCallButton();
    disableDialButton();
    removeReadyFromCall();
    enableReadOnlyInput();
    window.inCallModeActive = true;
  };

  function disableInCallInterface(){
    removeReadOnlyInput();
    enableCallButton();
    changeHoldIntoSkip();
    window.inCallModeActive = false;
  }

  function disableCallButton(){
    window.callButton.addClass('deactive');
  };

  function enableCallButton(){
    window.callButton.removeClass('deactive');
  };

  function enableDialButton(){
    window.dialpadCase.removeClass('deactive');
  };

  function disableDialButton(){
    window.dialpadCase.addClass('deactive');
  };

  function changeSkipIntoHold(){
    window.skipButton.html('Hold');
  };

  function changeHoldIntoSkip(){
    window.skipButton.html('Skip');
  };

  function changeClearIntoHangUp(){
    window.clearButton.html('Hang Up');
    window.clearButton.addClass('hangup');
  };

  function changeHangUpIntoClear(){
    if( window.clearButton.html('Hang Up') ){
      window.clearButton.html('Clear');
      window.clearButton.removeClass('hangup');
    }
  };

  function enableReadOnlyInput(){
    window.numberDisplayEl.attr('readonly','readonly');
  }

  function removeReadOnlyInput(){
    window.numberDisplayEl.removeAttr('readonly');
  }

  function refreshInputArray(){
    this.numberDisplayElContent = window.numberDisplayEl.val(); 
    window.numberArray = this.numberDisplayElContent.split('');
  };

  window.dialpadButton.click(function(){
    if( !$(dialpadCase).hasClass('deactive') ){
      var content = $(this).html();
      refreshInputArray();
      window.numberArray.push(content);
      compilePhoneNumber();
      updateDisplay();
      checkDisplayEl();
      saveNumberDisplayEl();
    }
  });

  window.skipButton.click(function(){
    if (window.inCallModeActive == true){
      holdNumber();
    }
  });

  function checkDisplayEl(){
    if( window.numberDisplayEl.val() != "" ){
      addReadyToClear();
      addReadyToCall();
      enableActionButtons();
    } else if ( window.numberDisplayEl.val() == "" ) {
      removeReadyFromClear();
      removeReadyFromCall();
      disableActionButtons();
    }
  }

  function disableActionButtons(){
    window.actionButtons.addClass('deactive');
  }

  function enableActionButtons(){
    window.actionButtons.removeClass('deactive');
  }

  function addReadyToCall(){
    window.callButton.addClass('ready');
  }

  function removeReadyFromCall(){
    window.callButton.removeClass('ready');
  }

  function addReadyToClear(){
    window.clearButton.addClass('ready');
  }

  function removeReadyFromClear(){
    window.clearButton.removeClass('ready');
  }

  function saveNumberDisplayEl(){
    lastNumberDisplayEl = window.numberDisplayEl.val()
  }

  function displayLastSavedNumberDisplayEl(){
    console.log('Last displayed element value: ' + lastNumberDisplayEl);
  }

  $('div#actions li.clear').click(function(){
    clearPhoneNumber();
    console.log("clicked hangup button! contact id :"+contactID);
    $.ajax({
      url: '/endcall',
      dataType: 'json',
      type: 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: {contactID:contactID},
      success: function( data, textStatus, jQxhr ){
        console.log("Endcall Request status:"+data);
        enableCallButton();
        enableDialButton();
        clearPhoneNumber();
        removeReadOnlyInput();
        changeHangUpIntoClear();
        updateDisplay();
        checkDisplayEl();
        disableInCallInterface();
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log('Request failed', errorThrown);
      }
    });
  });

  $('div#actions li.describeuser').click(function(){
    $.ajax({
      url: '/describeUser',
      dataType: 'json',
      type: 'post',
      contentType: 'application/x-www-form-urlencoded',
      success: function( data, textStatus, jQxhr ){
        console.log("Endcall Request status:"+data);
      },
      error: function( jqXhr, textStatus, errorThrown ){
        console.log('Request failed', errorThrown);
      }
    });
  });

  $('div#actions li.usersummary').click(function(){
    $.ajax({
      url: '/user',
      dataType: 'json',
      type: 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: {userId: "5b600fbf-cf34-4696-9d3b-933a48bdbcc3"},
      success: function( data, textStatus, jQxhr ){
        console.log("Endcall Request status:"+data);
      },
      error: function( jqXhr, textStatus, errorThrown ){
        console.log('Request failed', errorThrown);
      }
    });
  });

  $('div#actions li.call').click(function(){
    callNumber();
  });
})(jQuery);