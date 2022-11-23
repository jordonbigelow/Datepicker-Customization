///////////////////////////////////////////////////////////////////////////////////////////////
// This code was pulled from a Laserfiche article. The link is below.                        //
// https://answers.laserfiche.com/questions/170752/Ability-to-restrict-dates-in-forms#182435 //
// I added a new functionallity to count weekends and holidays, not all the code is original //
///////////////////////////////////////////////////////////////////////////////////////////////

//create the array of blackout dates
var blackoutDatesList = new Array();

//this function is run when the form is loaded
$(document).ready(function() {
  // To increase the date, change the number 30 to however many days needed.
  var maximumDays = 30;
  
  var today = new Date();
  var startDate = new Date();
  // Sets the start date as tomorrow
  startDate.setDate(today.getDate() + 1);
  var endDate = new Date();
  // Sets the endDate to be today's date + the maximumDays variable
  endDate.setDate(today.getDate() + maximumDays);
  var minDate = $.datepicker.formatDate('yy-mm-dd', new Date(startDate));
  var maxDate = $.datepicker.formatDate('yy-mm-dd', new Date(endDate));
  // Set the min and max date for the calendar
  $('.futureDateOnly input').attr('min',minDate);
  $('.futureDateOnly input').attr('max',maxDate);
  
  //the following four function work together to disable any dates on the picker 
  //that are weekends or are on the blackoutDatesList array
  //they also add a validation (parsley) setting for invalid date entries
  function isValidDate(n) {
    var t = n.getDay();
    var d = n.getDate();
    // format the date to check against the array of blackOutDateList
	var string = jQuery.datepicker.formatDate('yy-mm-dd', n);
    
    // if the day isn't a Saturday, Sunday, or Holiday, return True
    return (t!=6 && t!=0 && blackoutDatesList.indexOf(string) == -1);
  }
  function checkDate(n) {
    return[isValidDate(n),''];
  }
  function checkField(input, inst) {
    if ($(input).closest('li').hasClass('futureDateOnly')) {
      $(input).datepicker('option', {beforeShowDay: checkDate});
    }
  }
  
  $.datepicker.setDefaults( {beforeShow: checkField} );
  
  window.Parsley
  	.addValidator('limiteddate', { 
      validateString: function(value) {
        
        // Get date of today
        var tempDate = new Date();

        function getNextDate(myNextDate, businessDaysOut) {
            var FDate = new Date(myNextDate);
            // Set the date to be the tomorrow as we don't want
            // people setting the date for today's date
            FDate.setDate(FDate.getDate() + 1);
            var reachedBusinessDays = 0;
            
            // loop until 2 business days have been counted
            while (reachedBusinessDays < businessDaysOut) {
                // If the day is Saturday, Sunday, or a Holiday
                // add an aditional day
                var dateString = jQuery.datepicker.formatDate('yy-mm-dd', FDate);
                if (FDate.getDay() !=6 && FDate.getDay() !=0 && blackoutDatesList.indexOf(dateString) == -1) {
                    FDate.setDate(FDate.getDate() + 1);
                    reachedBusinessDays += 1;
                } else if (reachedBusinessDays < businessDaysOut) {
                    FDate.setDate(FDate.getDate() + 1);
                } // if it is an allowed business day, increment reachedBusinessDays 
                  // until we have gone two business days in the future
            }
            return (FDate);
        }
        
        // Current date + 2 business days + weekends and holidays
        var desiredDaysOutDate = getNextDate(tempDate, 2) ;
        // removes the timpestamp from the desiredDaysOutDate variable to compare it
        // to the myMoment object that doesn't have time attached to it
        desiredDaysOutDate.setHours(0,0,0,0);
        // check our outliers
        // IMPORTANT! this date format needs to match the format you set 
        // for the field on the layout page
        var validDate = isValidDate(moment(value, 'MM-DD-YYYY').toDate());
        
        // Create a moment object that is filled with the field's date
        // Then, convert it to a date object
        var myMoment = moment(value, 'MM-DD-YYYY').toDate();
        
        // if the date is earlier than it should be, display an invalid date message.
        if (myMoment.getTime() - desiredDaysOutDate.getTime() < 0) {
          validDate = false;
        }
        
        return validDate; },
      messages: {
        en: 'Not a valid date.'
      }
    });
  
  $('.futureDateOnly input').attr('data-parsley-limiteddate','');
});

//this function is run when the lookups are completed.
$(document).on('onloadlookupfinished', function () {
  //loop through each date in the blackout date list, and add it to an array
  blackoutDatesList.length = 0;
  $('.blackoutDates option').each(function() {
	blackoutDatesList.push(formatDate(new Date($(this).val())));
  });
});

//function to return any date formatted as yyyy-mm-dd
function formatDate(date) {
  var d = new Date(date),
    // month is 0 index so we need to add 1 to it
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  // if the month is a single digit add a zero to the front of it
  if (month.length < 2) 
    month = '0' + month;
  // if the day is a single digit add a zero to the front of it
  if (day.length < 2) 
    day = '0' + day;
  // return the date in a yyyy-mm-dd format
  return [year, month, day].join('-');
}
