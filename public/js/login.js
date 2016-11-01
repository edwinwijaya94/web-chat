$('input[type="submit"]').mousedown(function(){
  $(this).css('background', '#2ecc71');
});
$('input[type="submit"]').mouseup(function(){
  $(this).css('background', '#1abc9c');
});

$('#loginform').click(function(){
  $('.login').fadeToggle('slow');
  $(this).toggleClass('green');
});



$(document).mouseup(function (e)
{
    var container = $(".login");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide();
        $('#loginform').removeClass('green');
    }
});

$('form').submit(function(e) {
    e.preventDefault();

    $.ajax({
        type: 'POST',
        url: "/api/user/login",
        dataType: 'json',
        data: {
            name: $("input[name='name']").val(),
            password: $("input[name='password']").val()
        },
        success: function(response) {
            window.location.href = "/?id="+response.id;
        },
        error: function(xhr, status, error) {
            var message = JSON.parse(xhr.responseText).error;
            $('.alert').remove();
            $('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + message + '</div>').insertBefore($('form'));
        }
    })
});