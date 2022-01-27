/*
name: Bradley Showen, 
college: Seminole State College,
course: COP2831, 
instructor: Rebekah Gabel
*/
"use strict";
$(document).ready(function() {
    // Initialize the weather widget
    $('#weather_temp').openWeather({
        key: 'ac76c81fc03b816e49b3d06f76579506',
        city: 'Chattanooga', 
        units: 'f', 
        descriptionTarget: '#description',
        customIcons: './weather-plugin/src//img/icons/weather/',
        iconTarget: "#icon"
    });

    if(window.location.pathname.split("/").pop() == "history.html" || window.location.pathname.split("/").pop() == "activities.html"){
        // Initialize the carousel
        $('.carousel_container').slick({
            dots: true,
            arrows: true,
            autoplay: false, 
            fade: true
        });
    }

    //Expand and collapse "read more" and "read less" elements.
    $('.hidden').css('display','none');
    $('.card a').click(function(evt){
        //Expand only the links that do NOT have an href value
        if($(this).attr('href') == '#'){ 
            evt.preventDefault();
            var button = $(this);
            //find the collapsed content for the container that the user clicked on. 
            //If I simply expand all of the 'hidden' elements then I will expand every hidden element on the page. 
            //I don't want that. I only want to expand what the user clicked on. 
            var collapsableElement = button.parent().find('span');
            collapsableElement.toggle(200);
            // Toggle the button to say 'Read more' or 'Read less'
            button.text(`${button.text() == 'Read more' ? 'Read less' : 'Read more'}`);
        }
    });

    //animate the nav buttons
    $("nav#top > a").mouseover(function(){
        $(this  ).css({
            textDecoration: "underline", 
            textDecorationColor: "#000"
        });
    }).mouseout(function(){
        $(this  ).css({
            textDecoration: "none", 
        });
    });

    //style the buttons - side wide
    styleButtons($('.card_button'));
    function styleButtons(buttonElements){
        buttonElements.each((index, button)=>{
            var button = $(button);
            if(button.hasClass('left')){
                button.css({
                    borderTopRightRadius: '5px',
                    borderBottomRightRadius: '5px'
                });
            }else if(button.hasClass('right')){
                button.css({
                    borderTopLeftRadius: '5px',
                    borderBottomLeftRadius: '5px'
                });
            }else{
                button.css({
                    borderRadius: '5px',    
                });
            }
        })
    }

    // style the weather widget
    $('#weather_widget').parent().css({
        textDecoration: 'none',
        color: 'inherit'
    });

    //Reservation forms
    //form timer 
    var timer;
    var remainingSeconds = timerDefault();
    var timerDiv;
    function timerDefault(){
        if(remainingSeconds == null || remainingSeconds < 60){
            return 60;
        }
    }
    function formTimer(){
        if(timerDiv == null){
            timerDiv = $('.open').prev().find('.timer');
        }
        timerDiv.html(`${remainingSeconds}`);
        remainingSeconds--;
        if(remainingSeconds == -1){
            closeForms();
        }
    }
    // Click event which will show a form. 
    // First, I iterate through the DOM and close any forms that were left open. 
    // Then I animate the clicked element and slide it out of the way to reveal a form for the user to fill out. 
    $('.card_details .card_button').click(function(evt){
        $(this).parent().prev().attr("id", "active"); //add an id to the form_container
        closeForms(); //Destroy all forms before showing a new form. 
        var card = $(this).parent();
        var form_container = $(this).parent().prev();
        if(card.hasClass('left')){ //Slide to right
            slideRight(form_container);
        }else{ //Slide to left
            slideLeft(form_container);
        }
        $("#first_name").focus();
        evt.preventDefault();
    });
    // This function iterates through the DOM and closes any forms that were left open by the user. 
    function closeForms(){
        $('.form_container').each(function(){
            var formContainer = $(this);
                var cardContainer = $(this).next();
            // if a form_container is active leave it alone. 
            if(formContainer.attr("id") == "active"){
                // remove the id and leave the element alone. 
                formContainer.removeAttr("id");
            //if an element is not active and it is "open" then run the appropriate method to "close" the element. 
            }else if(formContainer.attr("id") != "active" && cardContainer.hasClass("open")){
                if(cardContainer.hasClass("left")){
                    slideRight(formContainer);
                }else{
                    slideLeft(formContainer);
                }
            }
        });
    }
    // Slide the element (parameter) to the right
    function slideRight(form_container){
        var button = form_container.next().find(".card_button");
        var card = button.parent();
        if(card.hasClass("closed")){ //reveal form
            card.removeClass("closed");
            card.addClass("open");
            button.text("<< Cancel");
            card.animate(
                {left: '36rem'},
                250
            ).animate(
                {left: '34.5rem'},
                150, 
                insertForm(form_container)
            );
            formTimer();
            timer = setInterval(formTimer, 1000);
        }else{ //Hide form because the user clicked the cancel button
            clearInterval(timer);
            remainingSeconds = timerDefault();
            timerDiv = null;
            card.addClass("closed");
            card.removeClass("open");
            button.text("Make a reservation");
            form_container.html("");
            card.animate(
                {left: '1.5rem'},
                250
            ).animate(
                {left: '3rem'},
                150
            );
        }
    }
    // Slide the element (parameter) to the left
    function slideLeft(form_container){
        var button = form_container.next().find(".card_button");
        var card = button.parent();
        if(card.hasClass("closed")){ //Reveal form
            card.removeClass("closed");
            card.addClass("open");
            button.text("Cancel >>");
            card.animate(
                {right: '36rem'},
                250
            ).animate(
                {right: '34.5rem'},
                150,
                insertForm(form_container)
            );
            formTimer();
            timer = setInterval(formTimer, 1000);
        }else{  //Hide form because the user clicked the cancel button
            clearInterval(timer);
            remainingSeconds = timerDefault();
            timerDiv = null;
            card.addClass("closed");
            card.removeClass("open");
            button.text("Make a reservation");
            form_container.html("");
            card.animate(
                {right: '1.5rem'},
                250
            ).animate(
                {right: '3rem'},
                150
            );
        }
    }
    // Inserts a form in the form_container. 
    // A form container is made visible by a user clicking a button to reveal the form. 
    // I use this JavaScript to insert and remove the form so there is only ever one form available on the page. 
    function insertForm(form_container){
        form_container.html( 
        "<form action='#' name='reservation_form' method='get'>" + 
            "<h2>Reservation</h2>" +
            "<div class='timer'></div>" +
            //First name
            "<div class='input_container'>" + 
            "<p>All items are required</p>" +
            "<label for='first_name'>First name:</label>" + 
            "<input type='text' id='first_name' name='first_name'>" + 
            "<span></span>" +
            //Last name
            "<label for='last_name'>Last name:</label>" + 
            "<input type='text' id='last_name' name='last_name'>" +  
            "<span></span>" +
            // Age
            "<label for='age'>Age:</label>" + 
            "<input type='text' id='age' name='age'>" +  
            "<span></span>" +
            //Date picker
            "<label for='date_picker'>Date:</label>" + 
            "<input type='text' name='date_picker' id='date_picker'>" + 
            "<span></span>" +
            //Time picker
            "<div id='time_picker_container'>" + 
                "<label for='time_picker'>Time:</label>" + 
                "<input type='text' name='time_picker' id='time_picker'>" + 
                "<span></span>" +
            "</div>" +
            //Checkboxes
            "<p>How should we contact you? <span id='contact'>*</span></p>" +
            "<label for='phone'>Phone:</label>" + 
            "<input type='radio' name='contact_method' id='phone'><br>" + 
            "<label for='email'>Email:</label>" + 
            "<input type='radio' name='contact_method' id='email'><br>" + 
            "<div id='contact_methods'>" + 
                //Email with validation
                //Phone number with validation
            "</div>" +
            //Submit button
            "<input class='card_button' type='submit' value='Reserve' id='submit'></input>" +
            //Reset button
            "</div>"+
        "</form>");

        //Toggle input fields based on user input. 
        $('[name=contact_method]').click(function(){
            var formField = $(this);
            $('#contact').html("*").css({color:'#fff'});
            if(formField.attr('id') == 'phone'){
                $("#contact_methods").html("<label for='phone_number'>Phone number:</label>" + 
                "<input type='text' name='phone_number' id='phone_number' placeholder='555-555-5555'>" + 
                "<span></span>");
                $('#phone_number').focus();
            }else{
                $("#contact_methods").html("<label for='email_address'>Email address:</label>" + 
                "<input type='email' name='email_address' id='email_address' placeholder='foo@bar.com'>" + 
                "<span></span>");
                $('#email_address').focus();
            }
        });

        // Initialize the date picker, and time picker jquery plugins.
        initializePlugins();

        // validate form
        $('#submit').click(function(evt){
            evt.preventDefault();
            var isFormValid = validateForm();
            if(isFormValid){
                $(this).parent().parent().parent().html("<h2>Thank you for making a reservation!</h2>")
                setTimeout(closeForms, 3000);
            }
        })

        // Dynamically update the range of time that a user is allowed to select from the dropdown menu based off the selected date for the reservation. 
        // I am allowing user to select values from 9:00am to 5:00pm. 
        // If the user selects today as the reservation date then the earliest time (min time) a user can select will be the current time. 
        // If the date is a date in the future then the user can select anytime from 9:00am to 5:00pm. 
        // Users are not able to select dates in the past. 
        $('#date_picker').change(function(){
            var selectedDate = new Date($('#date_picker').val().trim());
            var currentDate = new Date();
            selectedDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
            if(selectedDate > currentDate){
                selectedDate.setHours(9,0,0);
                $('#time_picker').timepicker('option','minTime',selectedDate).val("");
            }else{
                $('#time_picker').timepicker('option','minTime',currentDate).val("");
            }
        })
    }
    // This function simply returns true or false. 
    function validateForm(){
        var isValid = true;
        var firstName = $('#first_name');
        var lastName = $('#last_name');
        var age = $('#age');
        var dateElement = $('#date_picker');
        var selectedDate = new Date(dateElement.val().split("-")[0].trim());
        var currentDate = new Date();
        var emailAddress;
        var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isEmailValid;
        var phoneNumber;
        var phonePattern = /^(1[\s-\.])?(\()?\d{3}(\))?[\s-\.]\d{3}[-\.]\d{4}$/;
        var isPhoneNumberValid;
        var time;
        // Validate first name. It is required and must have a length > 0. 
        if(firstName.val().trim() == ""){
            firstName.css({borderColor:'#ff3333'});
            firstName.next().text('Please provide a first name.').addClass('error_message');
            isValid = false;
        }else{  
            firstName.val(firstName.val().trim());
            firstName.css({borderColor:'#3bb300'});
            firstName.next().text('').removeClass('error_message');
        }
        // Validate last name. It is required and must have a length > 0. 
        if(lastName.val().trim() == ""){
            lastName.css({borderColor:'#ff3333'});
            lastName.next().text('Please provide a last name.').addClass('error_message');
            isValid = false;
        }else{
            lastName.val(lastName.val().trim());
            lastName.css({borderColor:'#3bb300'});
            lastName.next().text('').removeClass('error_message');
        }
        // Validate age. It is required and user must be 18 years or older. 
        if(age.val().trim() == ""){
            age.css({borderColor:'#ff3333'});
            age.next().text('You must enter an age.').addClass('error_message');
            isValid = false;
        }else if(isNaN(parseInt(age.val().trim()))){
            age.css({borderColor:'#ff3333'});
            age.next().text('You must enter a number.').addClass('error_message');
            isValid = false;
        }else if(parseInt(age.val().trim()) < 18){
            age.css({borderColor:'#ff3333'});
            age.next().text('You must be 18 or older.').addClass('error_message');
            isValid = false;
        }else{
            age.val(age.val().trim());
            age.css({borderColor:'#3bb300'});
            age.next().text('').removeClass('error_message');
        }
        //  Validate the date. It is required. The form will always have a date but will only have a time selection on certain pages. Only validate the time if the time element is visible. The date must be greater than or equal to todays date. The time must be greater than or equal to the current time. 
        currentDate.setHours(0,0,0,0);
        if(currentDate > selectedDate){
            dateElement.next().addClass('error_message').text('Please select a date.');
            dateElement.css({borderColor: '#ff3333'}); 
            isValid = false;
        }else{
            dateElement.css({borderColor: '#3bb300'});
            dateElement.next().removeClass('error_message').text('');
        }
        // validate email address or phone number. There will be either email or phone to validate, not both. This is the reasoning for the if/else conditional which determines which element is visible. 
        if($('#email_address').is(':visible')){
            // validate email
            emailAddress = $('#email_address').val().trim();
            isEmailValid = emailPattern.test(emailAddress.toLowerCase());
            if(isEmailValid){
                $('#email_address').val(emailAddress);
                $('#email_address').css({borderColor: '#3bb300'});
                $('#email_address').next().removeClass('error_message').text('');
            }else{
                $('#email_address').css({borderColor: '#ff3333'});
                $('#email_address').next().addClass('error_message').text('Invalid email address.');
                isValid = false;
            }
        }else if($('#phone_number').is(':visible')){
            // validate phone number
            phoneNumber = $('#phone_number').val().trim();
            isPhoneNumberValid = phonePattern.test(phoneNumber);
            if(isPhoneNumberValid){
                $('#phone_number').val(phoneNumber);
                $('#phone_number').css({borderColor: '#3bb300'});
                $('#phone_number').next().removeClass('error_message').text('');
            }else{
                $('#phone_number').css({borderColor: '#ff3333'});
                $('#phone_number').next().addClass('error_message').text('Invalid phone number.')
                isValid = false;
            }
        }else{
            // This is reached when the user did not select a contact method. 
            isValid = false;
            $('#contact').css({color: '#ff3333'});
        }

        // Validate the time. Time is required. 
        if($('#time_picker').is(':visible')){
            time = $('#time_picker');
            if(time.val().trim() == ""){
                time.next().addClass('error_message').text("Please select a time");
                // time.next().addClass('error_message').text("Error")
                time.css({borderColor:'#ff3333'});
            }else{
                time.next().removeClass('error_message').text("");
                time.css({borderColor: '#3bb300'});
            }
        }
        return isValid;
    }
    // This function initializes certain plugins based on what page is loaded. 
    function initializePlugins(){
        switch(window.location.pathname.split("/").pop()){
            case "restaurants.html":
                $('#date_picker').daterangepicker({
                    singleDatePicker: true, 
                    minDate: new Date().toLocaleDateString(),
                    drops: "auto", 
                });
                $('#time_picker').timepicker({
                    timeFormat: 'h:mm p',
                    interval: 30,
                    minTime: new Date(),
                    maxTime: '9:00pm',
                    dynamic: false,
                    dropdown: true,
                    scrollbar: true
                });
            break;
            case "hotels.html":
                $('#date_picker').daterangepicker({
                    minDate: new Date().toLocaleDateString(),
                    drops: "auto"
                });
                // Remove the time input from forms if the form is for hotel reservations. 
                $('#time_picker_container').html('');
            break;

        }
    }
});