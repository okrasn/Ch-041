$(function(){
    var name = $('#name');
    var birthday = $('#birthday');
    var email  = $('#email');
    var idNumber = $('#id_number');
    var pattern = /^[A-Z]+[a-z]*$/;
    var nameSuccess = $('#name_success');
    var nameError = $('#name_error');
    var birthdaySuccess = $('#birthday_success');
    var birthdayError = $('#birthday_error');
    var emailSuccess = $('#email_success');
    var emailError = $('#email_error');
    var idNumberSuccess = $('#id_number_success');
    var idNumberError = $('#id_number_error');

    name.keyup(function(event){
       if(pattern.test($('#name').val())){
           nameError.removeClass('show');
           nameSuccess.addClass('show').css({color:'green'});
       }else{
           nameError.addClass('show').css({color:'red'});
           nameSuccess.removeClass('show');
       }
   });

    birthday.keyup(function(){
        if(document.getElementById('birthday').validity.valid){
            birthdayError.removeClass('show');
            birthdaySuccess.addClass('show').css({color:'green'});
        }else{
            birthdayError.addClass('show').css({color:'red'});
            birthdaySuccess.removeClass('show');
        }
    });
    email.keyup(function(){
        if(document.getElementById('email').validity.valid){
            emailError.removeClass('show');
            emailSuccess.addClass('show').css({color:'green'});
        }else{
            emailError.addClass('show').css({color:'red'});
            emailSuccess.removeClass('show');
        }
    });
    idNumber.keyup(function(){
        if(document.getElementById('id_number').validity.valid){
            idNumberError.removeClass('show');
            idNumberSuccess.addClass('show').css({color:'green'});
        }else{
            idNumberError.addClass('show').css({color:'red'});
            idNumberSuccess.removeClass('show');
        }
    });

    $("#open_form_btn").click(function(){
        $("#model_with_form").modal();
    });


});

