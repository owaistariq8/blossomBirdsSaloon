$(document).ready(function (){

  var queryString = getUrlVars();
  var isLoggedIn = $.cookie("loggedIn");
  if(isLoggedIn) {
    var user = JSON.parse($.cookie('user'));
    window.location.href = '/profile.html?id='+user.id;
  }


  $(document).on('click','#signp',function(){
    console.log('clicked');
    let formData =  $('#signpForm').serialize()
    $.ajax({
      type: "POST",
      url: 'http://localhost:5000/signup',
      data: formData,
      success: function(result){
        console.log(result);
        if(result && result.success=='yes') {
          window.location.href = '/login.html'
        }
        else {
          alert(result.message)
        }
      },
      dataType: 'json'
    });
  })


  $(document).on('click','#login',function(){
    console.log('clicked');
    let formData =  $('#loginForm').serialize()
    $.ajax({
      type: "POST",
      url: 'http://localhost:5000/login',
      data: formData,
      success: function(result){
        console.log(result);
        if(result && result.success=='yes') {
          $.cookie("loggedIn", 1);
          $.cookie("user", JSON.stringify(result.user));
          window.location.href = '/profile.html?id='+result.user.id;
        }
        else {
          alert(result.message)
        }
      },
      dataType: 'json'
    });
  })

  $('#profilePicture').on('change', function () {
    let file = this.files[0];
    console.log(URL.createObjectURL(file));
    $(".avatar").prop('src',URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", queryString['id']);

    $.ajax({
      type: "POST",
      url: 'http://localhost:5000/updateProfilePictureUser',
      data:formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(result){
        console.log(result);
        if(result && result.success=='yes') {
          
        }
        else {
          alert(result.message)
        }
      },
      dataType: 'json'
    });
  });


  $(document).on('click',"#logout",function(){
    $.removeCookie('user');
    $.removeCookie('loggedIn');
    window.location.href = '/'
  })

  
  $(document).on('click','#saveProfile',function(){
    console.log('clicked');
    $.ajax({
      type: "POST",
      url: 'http://localhost:5000/updateUserProfile',
      data: $("#profileForm").serialize(),
      success: function(result){
        console.log(result);
        if(result && result.success=='yes') {
          window.location.reload();
        }
        else {
          alert(result.message)
        }
      },
      dataType: 'json'
    });
  })

})


function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}