(function(){
    $(document).ready(function(){
    var validator = $("#loginform").validate({ 
       rules:{ 
            mail:{
                required: true,
                email: true,
            },
            pwd:{
                required: true,
            }
       },
       messages:{
            mail:{
                required: "This field is required ",
                email: "",
            },

            pwd:{
                required: "This field is required ",
            }        
       }           
    });
    var validator = $("#registration").validate({
        rules:{ 
            mail:{
                required: true,
                email: true,
                minlength: 9,
                maxlength: 20,
            },
            pwd:{
                required: true,
                minlength: 6,
                maxlength: 20,
            },
            reppwd:{
                required: true,
                minlength: 6,
                maxlength: 20,
            }
       },
       messages:{        
            mail:{
                required: "This field is required ",
                email: "Please, use example: jacksparrow@gmail.com ",
                minlength: "Please, enter at least 9 characters ",
                maxlength: "Please, enter no more than 20 characters. "
            },

            pwd:{
                required: "This field is required ",
                minlength: "Please, enter at least 6 characters ",
                maxlength: "Please, enter no more than 20 characters. "
            },

            reppwd:{
                required: "This field is required ",
                minlength: "Please, enter at least 6 characters ",
                maxlength: "Please, enter no more than 20 characters. "
            }
       }           
    });
}); //end of ready
})();
