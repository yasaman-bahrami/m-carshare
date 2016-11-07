/*
* Signup form for Members
* Created by Bina Javed on November 04, 2016
*/

// Function to send Signup form to server

$(document).ready(function(e) {
    $('#signup_form').submit(function(e) {

        $.ajax({
            url:  $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            beforeSend: function(XMLHttpRequest) {
                $('#signup_form .has-error').removeClass('has-error');
                 },
            success: function(json, textStatus) {

                if (json.error) {
                    if (json.error.email) {
                        $('#signup_form input[name="email"]').parent().addClass('has-error');
                        $('#signup_form input[name="email"]').next('.help-block').html(json.error.email).slideDown();
                    }
                }

                if (json.success) {
                    $('#form_message').addClass('alert-success').html(json.success).slideDown();
                    $('#signup_form')[0].reset();

                    setTimeout(function() {
                        $('#form_message').slideUp("fast", function() {
                            $(this).removeClass('alert-success').html('');
                        });
                    }, 4000);
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                //
            }
        });

        return false;
    });
});